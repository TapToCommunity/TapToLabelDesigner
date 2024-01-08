import { useCallback } from 'react';
import type { JSX, RefObject } from 'react';
import type { Canvas } from 'fabric';

type PdfButtonProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

export const PdfButton = ({ canvasArrayRef }: PdfButtonProps): JSX.Element => {
  const preparePdf = useCallback(() => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF({
        orientation: 'p',
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
          const newPageNumber = Math.floor(index / 10);
          if (newPageNumber > pageNumber) {
            doc.addPage('a4', 'p');
            pageNumber = newPageNumber;
          }
          const column = index % 2;
          // reset rows every 5;
          const row = Math.floor(index / 2) % 5;

          const htmlCanvas = canvas.toCanvasElement(2 / canvas.getZoom(), {
            top: top * canvas.getZoom(),
            left: left * canvas.getZoom(),
            width: width * canvas.getZoom(),
            height: height * canvas.getZoom(),
          });

          doc.addImage(
            htmlCanvas,
            'PNG',
            column * 105 + 10,
            row * 59.4 + 2.5,
            85.5,
            54,
          );
        });
      }
      doc.save(`tapto-a4-${new Date().getTime()}.pdf`);
    });
  }, [canvasArrayRef]);

  return <button onClick={preparePdf}>make PDF</button>;
};

export default PdfButton;
