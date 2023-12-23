import type { Canvas } from 'fabric';
import { useRef, useEffect } from 'react';
import { cardLikeOptions } from '../constants';

type WrapperProp = {
  file: File;
  setFabricCanvas: (canvas: Canvas | null) => void;
}

export const FabricCanvasWrapper = ({ file, setFabricCanvas }: WrapperProp) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let fabricCanvas: Canvas;
    if (canvasRef.current) {
      import('fabric').then(({ Canvas, FabricImage, util, Rect, FabricObject }) => {
        FabricObject.ownDefaults.originX = 'center';
        FabricObject.ownDefaults.originY = 'center';
        fabricCanvas = new Canvas(canvasRef.current!, {
          width: 855,
          height: 540
        });
        const cardBorder = new Rect(cardLikeOptions);
        cardBorder.canvas = fabricCanvas;
        fabricCanvas.clipPath = cardBorder;
        fabricCanvas.backgroundImage = cardBorder;
        fabricCanvas.centerObject(cardBorder);
        const imageUrl = URL.createObjectURL(file);
        if (file) {
          util.loadImage(imageUrl).then((image) => {
            const fabricImage = new FabricImage(image);
            const scale = util.findScaleToCover(fabricImage, fabricCanvas);
            fabricImage.scaleX = scale;
            fabricImage.scaleY = scale;
            fabricCanvas.add(fabricImage);
            fabricCanvas.centerObject(fabricImage);
            setFabricCanvas(fabricCanvas);
          });
        }
      });
    }
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
      setFabricCanvas(null);
    };
  }, [setFabricCanvas, file]);

  return (
    <canvas ref={canvasRef} />
  );
}