import {
  addCanvasToPdfPage,
  createDownloadStream,
} from '../extensions/fabricToPdfKit';
import { type PrintOptions } from '../contexts/appData';
import { printTemplates } from '../printTemplates';
import { type CardData } from '../contexts/fileDropper';

const fromMMtoPoint = (x: number): number => (x / 25.4) * 72;

export const preparePdf = async (
  printOptions: PrintOptions,
  cards: CardData[],
) => {
  const { printerTemplateKey, cutMarks } = printOptions;
  const printerTemplate = printTemplates[printerTemplateKey];
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

  const { default: PDFDocument } = await import(
    'pdfkit/js/pdfkit.standalone.js'
  );
  const pdfDoc = new PDFDocument({ autoFirstPage: false });
  const downloadPromise = createDownloadStream(pdfDoc);
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

  if (cards) {

    let pageNumber = 0;
    pdfDoc.addPage({ margins: 0, size: ptPaperSize });
    pdfDoc.switchToPage(pageNumber);
    for (let index = 0; index < cards.length; index++) {
      const canvas = cards[index].canvas!;
      const newPageNumber = Math.floor(index / labelsPerPage);
      if (newPageNumber > pageNumber) {
        // do the cropmarks
        cutMarks === 'crop' && makeTheCropMarks();
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

      if (cutMarks === 'crop' ) {
        cutHelperX.add(xStart);
        cutHelperX.add(xStart + width);
        cutHelperY.add(yStart);
        cutHelperY.add(yStart + height);
      }

      const imageNeedsRotation = cards[index].template?.layout === 'vertical';

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
  cutMarks === 'crop' && makeTheCropMarks();
  pdfDoc.end();
  downloadPromise.then((blob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'test.pdf';
    link.click();
    link.remove();
  });
};
