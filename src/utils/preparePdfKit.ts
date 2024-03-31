import type { RefObject } from 'react';
import type { templateType } from '../cardsTemplates';
import type { PrintTemplate } from '../printTemplates';
import type { Canvas } from 'fabric';
import {
  addCanvasToPdfPage,
  createDownloadStream,
} from '../extensions/fabricToPdfKit';

const fromMMtoPoint = (x: number): number => (x / 25.4) * 72;


export const preparePdf = async (
  printerTemplate: PrintTemplate,
  template: templateType,
  canvasArrayRef: RefObject<Canvas[]>,
) => {
  const { gridSize, leftMargin, topMargin, paperSize, columns, rows } =
    printerTemplate;

  const labelsPerPage = rows * columns;

  let ptPaperSize = paperSize;
  if (Array.isArray(paperSize)) {
    ptPaperSize = (paperSize as [number, number]).map(fromMMtoPoint) as [
      number,
      number,
    ];
  }

  const imageNeedsRotation = template.layout === 'vertical';

  const { default: PDFDocument } = await import(
    'pdfkit/js/pdfkit.standalone.js'
  );
  const pdfDoc = new PDFDocument({ autoFirstPage: false });
  const downloadPromise = createDownloadStream(pdfDoc);
  const canvases = canvasArrayRef.current;
  const paperHeightInPt = fromMMtoPoint(paperSize[1])
  const topMarginInPt = fromMMtoPoint(topMargin);
  const paperWidthInPt = fromMMtoPoint(paperSize[0])
  const leftMarginInPt = fromMMtoPoint(leftMargin);
  const cutHelperX = new Set();
  const cutHelperY = new Set();

  const makeTheCropMarks = () => {
    pdfDoc.lineWidth(0.2);
    // for each xValue draw 2 vertical lines from 0 to topMargin and from end of page to -topMargin.
    cutHelperX.forEach((xValue) => {
      pdfDoc.moveTo(xValue, 0);
      pdfDoc.lineTo(xValue, topMarginInPt);
      pdfDoc.moveTo(xValue, paperHeightInPt - topMarginInPt - 1);
      pdfDoc.lineTo(xValue, paperHeightInPt);
    });
    // for each xValue draw 2 vertical lines from 0 to topMargin and from end of page to -topMargin.
    cutHelperY.forEach((yValue) => {
      pdfDoc.moveTo(0, yValue);
      pdfDoc.lineTo(leftMarginInPt, yValue);
      pdfDoc.moveTo(paperWidthInPt - leftMarginInPt, yValue);
      pdfDoc.lineTo(paperWidthInPt, yValue);
    });
    pdfDoc.stroke();
    cutHelperX.clear();
    cutHelperY.clear();
  }

  if (canvases) {

    let pageNumber = 0;
    pdfDoc.addPage({ margins: 0, size: ptPaperSize });
    pdfDoc.switchToPage(pageNumber);
    for (let index = 0; index < canvases.length; index++) {
      const canvas = canvases[index];
      const newPageNumber = Math.floor(index / labelsPerPage);
      if (newPageNumber > pageNumber) {
        // do the cropmarks
        makeTheCropMarks();
        pageNumber = newPageNumber;
        pdfDoc.addPage({ margins: 0, size: ptPaperSize });
        pdfDoc.switchToPage(pageNumber);
      }
      const column = index % columns;
      const row = Math.floor(index / columns) % rows;

      const xStart = fromMMtoPoint(column * gridSize[0] + leftMargin);
      const yStart = fromMMtoPoint(row * gridSize[1] + topMargin);
      const width = fromMMtoPoint(85);
      const height = fromMMtoPoint(54);

      cutHelperX.add(xStart);
      cutHelperX.add(xStart + width);
      cutHelperY.add(yStart);
      cutHelperY.add(yStart + height);

      await addCanvasToPdfPage(
        canvas,
        pdfDoc,
        {
          x: xStart,
          y: yStart,
          width,
          height,
        },
        imageNeedsRotation,
      );
    }
  }
  makeTheCropMarks();
  pdfDoc.end();
  downloadPromise.then((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test.pdf';
    link.click();
    link.remove();
  });
};
