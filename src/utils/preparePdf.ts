import type { RefObject } from 'react';
import type { templateType } from '../cardsTemplates';
import type { PrintTemplate } from '../printTemplates';
import type { Canvas } from 'fabric';
import { util } from 'fabric';

export const preparePdf = async (printerTemplate: PrintTemplate, template: templateType, canvasArrayRef: RefObject<Canvas[]>) => {
  const {
    gridSize,
    labelsPerPage,
    leftMargin,
    topMargin,
    layout,
    columns,
    rows,
  } = printerTemplate;

  const imageNeedsRotation = template.layout === 'vertical';

  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF({
      orientation: layout,
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16, // or "smart", default is 16
    });
    const canvases = canvasArrayRef.current;
    if (canvases) {
      let pageNumber = 0;
      canvases.map((canvas, index) => {
        const { top, left, width, height } =
          canvas.clipPath!.getBoundingRect();
        const newPageNumber = Math.floor(index / labelsPerPage);
        if (newPageNumber > pageNumber) {
          doc.addPage('a4', layout);
          pageNumber = newPageNumber;
        }
        const column = index % columns;
        const row = Math.floor(index / columns) % rows;
        // TODO: the top and left values should take in account of viewport translations
        const htmlCanvas = canvas.toCanvasElement(2 / canvas.getZoom(), {
          top: top * canvas.getZoom(),
          left: left * canvas.getZoom(),
          width: width * canvas.getZoom(),
          height: height * canvas.getZoom(),
        });

        let rotatedHtmlCanvas = htmlCanvas;
        if (imageNeedsRotation) {
          rotatedHtmlCanvas = document.createElement('canvas');
          rotatedHtmlCanvas.width = htmlCanvas.height;
          rotatedHtmlCanvas.height = htmlCanvas.width;
          const ctx = rotatedHtmlCanvas.getContext('2d');
          if (ctx) {
            ctx.translate(htmlCanvas.height / 2, htmlCanvas.width / 2);
            ctx.rotate(util.degreesToRadians(90));
            ctx.drawImage(
              htmlCanvas,
              -htmlCanvas.width / 2,
              -htmlCanvas.height / 2,
            );
          }
        }

        doc.addImage(
          rotatedHtmlCanvas,
          'PNG',
          column * gridSize[0] + leftMargin,
          row * gridSize[1] + topMargin,
          85.5,
          54,
        );
      });
    }
    doc.save(`tapto-a4-${new Date().getTime()}.pdf`);
  });
}