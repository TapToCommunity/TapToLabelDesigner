import { useCallback } from 'react';
import type { JSX, RefObject } from 'react';
import type { Canvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';

type PdfButtonProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

export const PdfButton = ({ canvasArrayRef }: PdfButtonProps): JSX.Element => {
  const { template } = useAppDataContext();

  const preparePdf = useCallback(() => {
    const isH = template.layout === 'horizontal';
    import('jspdf').then(({ jsPDF }) => {
      const orientation = isH ? 'l' : 'p';
      const safePrinterMargin = 15;
      const labelsPerPage = 9;
      const gridSize = [90, 59];
      const doc = new jsPDF({
        orientation,
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
            doc.addPage('a4', orientation);
            pageNumber = newPageNumber;
          }
          const column = index % 3;
          // reset rows every 5;
          const row = Math.floor(index / 3) % 3;
          // TODO: the top and left values should take in account of viewport translations
          const htmlCanvas = canvas.toCanvasElement(2 / canvas.getZoom(), {
            top: top * canvas.getZoom(),
            left: left * canvas.getZoom(),
            width: width * canvas.getZoom(),
            height: height * canvas.getZoom(),
          });

          doc.addImage(
            htmlCanvas,
            'PNG',
            column * gridSize[0] + safePrinterMargin,
            row * gridSize[1] + safePrinterMargin,
            85.5,
            54,
          );
        });
      }
      doc.save(`tapto-a4-${new Date().getTime()}.pdf`);
    });
  }, [canvasArrayRef, template.layout]);

  return <button onClick={preparePdf}>make PDF</button>;
};

export default PdfButton;
