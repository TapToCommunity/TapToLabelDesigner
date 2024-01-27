import { useRef, useEffect, useTransition } from 'react';
import { cardLikeOptions } from '../constants';
import { StaticCanvas, Rect, FabricObject, type Canvas } from 'fabric';

type WrapperProp = {
  setFabricCanvas: (canvas: StaticCanvas | null) => void;
};

export const FabricCanvasWrapper = ({ setFabricCanvas }: WrapperProp) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (canvasRef.current) {
      FabricObject.ownDefaults.originX = 'center';
      FabricObject.ownDefaults.originY = 'center';
      const fabricCanvas = new StaticCanvas(canvasRef.current!, {
        width: cardLikeOptions.width,
        height: cardLikeOptions.height,
        renderOnAddRemove: false,
      });
      const cardBorder = new Rect(cardLikeOptions);
      cardBorder.canvas = fabricCanvas as Canvas;
      fabricCanvas.clipPath = cardBorder;
      fabricCanvas.backgroundImage = cardBorder;
      fabricCanvas.centerObject(cardBorder);
      startTransition(() => {
        setFabricCanvas(fabricCanvas);
      });
      return () => {
        if (fabricCanvas) {
          fabricCanvas.dispose();
        }
      };
    }
  }, [setFabricCanvas]);

  return <canvas ref={canvasRef} />;
};
