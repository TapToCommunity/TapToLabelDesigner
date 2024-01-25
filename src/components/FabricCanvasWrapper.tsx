import { useRef, useEffect, useTransition } from 'react';
import { cardLikeOptions } from '../constants';
import {
  StaticCanvas,
  FabricImage,
  util,
  Rect,
  FabricObject,
  type Canvas,
} from 'fabric';

type WrapperProp = {
  file: File | HTMLImageElement;
  setFabricCanvas: (canvas: StaticCanvas | null) => void;
};

export const FabricCanvasWrapper = ({ file, setFabricCanvas }: WrapperProp) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (canvasRef.current) {
      FabricObject.ownDefaults.originX = 'center';
      FabricObject.ownDefaults.originY = 'center';
      const fabricCanvas = new StaticCanvas(canvasRef.current!, {
        width: cardLikeOptions.width,
        height: cardLikeOptions.height,
      });
      const cardBorder = new Rect(cardLikeOptions);
      cardBorder.canvas = fabricCanvas as Canvas;
      fabricCanvas.clipPath = cardBorder;
      fabricCanvas.backgroundImage = cardBorder;
      fabricCanvas.centerObject(cardBorder);
      const imagePromise =
        file instanceof Blob
          ? util.loadImage(URL.createObjectURL(file))
          : Promise.resolve(file);
      if (file) {
        imagePromise.then((image) => {
          const fabricImage = new FabricImage(image);
          const scale = util.findScaleToCover(fabricImage, fabricCanvas);
          fabricImage.scaleX = scale;
          fabricImage.scaleY = scale;
          fabricCanvas.add(fabricImage);
          fabricCanvas.centerObject(fabricImage);
          startTransition(() => {
            setFabricCanvas(fabricCanvas);
          });
        });
      }
      return () => {
        if (fabricCanvas) {
          fabricCanvas.dispose();
        }
      };
    }
  }, [setFabricCanvas, file]);

  return (
    <canvas
      ref={canvasRef}
      key={`${(file as File).name || (file as HTMLImageElement).src}`}
    />
  );
};
