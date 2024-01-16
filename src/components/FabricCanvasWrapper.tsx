import { useRef, useEffect } from 'react';
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
  file: File;
  setFabricCanvas: (canvas: StaticCanvas | null) => void;
};

export const FabricCanvasWrapper = ({ file, setFabricCanvas }: WrapperProp) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      return () => {
        if (fabricCanvas) {
          fabricCanvas.dispose();
        }
      };
    }
  }, [setFabricCanvas, file]);

  return <canvas ref={canvasRef} key={`${file.name}`} />;
};
