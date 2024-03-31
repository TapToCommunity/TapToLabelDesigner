import type { RefObject } from 'react';
import type { templateType } from '../cardsTemplates';
import type { Canvas } from 'fabric';
import { util } from 'fabric';
import type { PrintOptions } from '../contexts/appData';
import { printTemplates } from '../printTemplates';

export const preparePdf = async (printOptions: PrintOptions, template: templateType, canvasArrayRef: RefObject<Canvas[]>) => {
  const { printerTemplateKey, cutMarks } = printOptions;
  const printerTemplate = printTemplates[printerTemplateKey];
  const {
    gridSize,
    leftMargin,
    topMargin,
    layout,
    paperSize,
    columns,
    rows,
  } = printerTemplate;

  const labelsPerPage = rows * columns;

  const imageNeedsRotation = template.layout === 'vertical';

  import('jspdf').then(({ jsPDF }) => {
    const doc = new jsPDF({
      orientation: layout,
      unit: 'mm',
      format: paperSize,
      putOnlyUsedFonts: true,
      floatPrecision: 16, // or "smart", default is 16
    });

    const cutHelperX = new Set<number>();
    const cutHelperY = new Set<number>();

    const makeTheCropMarks = () => {
      const paperHeight = paperSize[1];
      const paperWidth = paperSize[0];
      doc.setLineWidth(0.1);
      // for each xValue draw 2 vertical lines from 0 to topMargin and from end of page to -topMargin.
      cutHelperX.forEach((xValue) => {
        doc.moveTo(xValue, 0);
        doc.lineTo(xValue, topMargin);
        doc.moveTo(xValue, paperHeight - topMargin - 1);
        doc.lineTo(xValue, paperHeight);
      });
      // for each xValue draw 2 vertical lines from 0 to topMargin and from end of page to -topMargin.
      cutHelperY.forEach((yValue) => {
        doc.moveTo(0, yValue);
        doc.lineTo(leftMargin, yValue);
        doc.moveTo(paperWidth - leftMargin, yValue);
        doc.lineTo(paperWidth, yValue);
      });
      doc.stroke();
      cutHelperX.clear();
      cutHelperY.clear();
    }

    const canvases = canvasArrayRef.current;
    if (canvases) {
      let pageNumber = 0;
      canvases.map((canvas, index) => {
        const { top, left, width, height } =
          canvas.clipPath!.getBoundingRect();
        const newPageNumber = Math.floor(index / labelsPerPage);
        if (newPageNumber > pageNumber) {
          cutMarks === 'crop' && makeTheCropMarks();
          doc.addPage(paperSize, layout);
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

        const posX = column * gridSize[0] + leftMargin;
        const posY = row * gridSize[1] + topMargin;

        if (cutMarks === 'crop' ) {
          cutHelperX.add(posX);
          cutHelperX.add(posX + 85.5);
          cutHelperY.add(posY);
          cutHelperY.add(posY + 54);
        }

        doc.addImage(
          rotatedHtmlCanvas,
          'PNG',
          posX,
          posY,
          85.5,
          54,
        );
      });
    }
    cutMarks === 'crop' && makeTheCropMarks();
    doc.save(`tapto-a4-${new Date().getTime()}.pdf`);
  });
}