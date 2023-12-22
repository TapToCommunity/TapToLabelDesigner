import { Canvas, FabricImage, util, Rect, FabricObject } from 'fabric';
import { useRef, useEffect } from 'react';

FabricObject.ownDefaults.originX = 'center';
FabricObject.ownDefaults.originY = 'center';

type WrapperProp = {
  file: File;
  setFabricCanvas: (canvas: Canvas | null) => void;
}

const cardLikeOptions = {
  width: 854,
  height: 539,
  rx: 30,
  ry: 30,
  strokeWidth: 1,
  stroke: 'black',
  strokeUniform: true,
  fill: 'white',
};

export const FabricCanvasWrapper = ({ file, setFabricCanvas }: WrapperProp) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new Canvas(canvasRef.current, {
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
      return () => {
        fabricCanvas.dispose();
        setFabricCanvas(null);
      };
    }
  }, [setFabricCanvas, file]);

  return (
    <canvas ref={canvasRef} />
  );
}