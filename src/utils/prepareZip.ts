import type { RefObject } from 'react';
import type { Canvas } from 'fabric';
import type { InputWithSizeMeta } from 'client-zip';

export const prepareZip = async (canvasArrayRef: RefObject<Canvas[]>) => {
  const { downloadZip } = await import('client-zip')
  const canvases = canvasArrayRef.current;
  if (canvases) {
    const inputs = await Promise.all(canvases.map<Promise<InputWithSizeMeta>>((canvas, index) => {
      const { top, left, width, height } =
        (canvas.overlayImage || canvas.clipPath)!.getBoundingRect();
      // TODO: the top and left values should take in account of viewport translations
      const htmlCanvas = canvas.toCanvasElement(2 / canvas.getZoom(), {
        top: top * canvas.getZoom(),
        left: left * canvas.getZoom(),
        width: width * canvas.getZoom(),
        height: height * canvas.getZoom(),
      });
      return new Promise((resolve) => {
        htmlCanvas.toBlob((blob) => {
          blob && resolve({
            name: `label_${index}.png`,
            lastModified: Date.now(),
            input: blob,
            size: blob.size,
          }) 
        })
      })
    }));
    const blob = await downloadZip(inputs).blob();
    // trigger download
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "labels.zip"
    link.click()
    link.remove()
  }
}