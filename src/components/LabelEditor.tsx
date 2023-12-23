import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import { Canvas, util } from 'fabric';
import { cardLikeOptions, cardRatio } from '../constants';

type LabelEditorProps = {
  file: File;
  canvasArrayRef: RefObject<Canvas[]>;
  index: number;
}

export const LabelEditor = ({ file, canvasArrayRef, index }: LabelEditorProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  const padderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
      if (canvasArrayRef.current) {
        canvasArrayRef.current[index] = fabricCanvas;
      }
      const resizeObserver = new ResizeObserver((entries) => {
        const bbox = entries[0].contentRect;
        const chosenWidth = Math.floor(bbox.width - 20);
        fabricCanvas.setDimensions({
          width: chosenWidth,
          height: Math.ceil(chosenWidth / cardRatio),
        });
        const scale = util.findScaleToFit(cardLikeOptions, fabricCanvas);
        fabricCanvas.setZoom(scale);
      });
      resizeObserver.observe(divRef);
      return () => {
        resizeObserver.unobserve(divRef);
      }
    }
  }, [fabricCanvas]);

  return (
    <div className="labelContainer" ref={padderRef}>
      <div className="labelPadder"></div>
      <FabricCanvasWrapper
        setFabricCanvas={setFabricCanvas}
        file={file} 
      />
    </div>
  );
}