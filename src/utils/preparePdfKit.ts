import type { RefObject } from 'react';
import type { templateType } from '../cardsTemplates';
import type { PrintTemplate } from '../printTemplates';
import type { Canvas } from 'fabric';
import { addCanvasToPdfPage, createDownloadStream } from '../extensions/fabricToPdfKit';

const fromMMtoPoint = (x: number): number => x / 25.4 * 72;

export const preparePdf = async (printerTemplate: PrintTemplate, template: templateType, canvasArrayRef: RefObject<Canvas[]>) => {
  const {
    gridSize,
    leftMargin,
    topMargin,
    paperSize,
    columns,
    rows,
  } = printerTemplate;

  const labelsPerPage = rows * columns;

  let ptPaperSize = paperSize
  if (Array.isArray(paperSize)) {
    ptPaperSize = (paperSize as [number, number]).map(fromMMtoPoint) as [number, number];
  }

  const imageNeedsRotation = template.layout === 'vertical';

  const {  default: PDFDocument } = await import('pdfkit/js/pdfkit.standalone.js');
  const pdfDoc = new PDFDocument({ autoFirstPage: false });
  const downloadPromise = createDownloadStream(pdfDoc);
  const canvases = canvasArrayRef.current;
  if (canvases) {
    let pageNumber = 0;
    pdfDoc.addPage({ margins: 0, size: ptPaperSize });
    pdfDoc.switchToPage(pageNumber);
    for (let index = 0; index < canvases.length; index++) {
      const canvas = canvases[index];
      const newPageNumber = Math.floor(index / labelsPerPage);
      if (newPageNumber > pageNumber) {
        pageNumber = newPageNumber;
        pdfDoc.addPage({ margins: 0, size: ptPaperSize });
        pdfDoc.switchToPage(pageNumber);
      }
      const column = index % columns;
      const row = Math.floor(index / columns) % rows;
    
      await addCanvasToPdfPage(canvas, pdfDoc, {
        x: fromMMtoPoint(column * gridSize[0] + leftMargin),
        y: fromMMtoPoint(row * gridSize[1] + topMargin),
        width: fromMMtoPoint(85),
        height: fromMMtoPoint(54),
      }, imageNeedsRotation);
    }
  }
  pdfDoc.end();
  downloadPromise.then((blob) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "test.pdf"
    link.click()
    link.remove()
  });
}