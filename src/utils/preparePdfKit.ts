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

  import('pdfkit/js/pdfkit.standalone.js').then(({ default: PDFDocument }) => {
    const pdfDoc = new PDFDocument({ autoFirstPage: false });
    const downloadPromise = createDownloadStream(pdfDoc);
    const canvases = canvasArrayRef.current;
    if (canvases) {
      let pageNumber = 0;
      pdfDoc.addPage({ margins: 0, size: ptPaperSize });
      pdfDoc.switchToPage(pageNumber);
      canvases.map((canvas, index) => {
        const newPageNumber = Math.floor(index / labelsPerPage);
        if (newPageNumber > pageNumber) {
          pageNumber = newPageNumber;
          pdfDoc.addPage({ margins: 0, size: ptPaperSize });
          pdfDoc.switchToPage(pageNumber);
        }
        const column = index % columns;
        const row = Math.floor(index / columns) % rows;
      
        addCanvasToPdfPage(canvas, pdfDoc, {
          x: fromMMtoPoint(column * gridSize[0] + leftMargin),
          y: fromMMtoPoint(row * gridSize[1] + topMargin),
          width: fromMMtoPoint(85),
          height: fromMMtoPoint(54),
        });
        if (imageNeedsRotation) {
          console.log('...');
        }
      });
    }
    pdfDoc.end();
    return downloadPromise;
    // startingDoc.save(`tapto-a4-${new Date().getTime()}.pdf`);
  });
}