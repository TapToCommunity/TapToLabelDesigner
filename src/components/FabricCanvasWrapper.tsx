import { useRef, useEffect, useTransition } from 'react';
import { StaticCanvas, FabricObject } from 'fabric';

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
        renderOnAddRemove: false,
        backgroundColor: 'white',
      });
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
