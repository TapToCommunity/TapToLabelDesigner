import { useEffect, useState, useRef } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import { Canvas, util } from 'fabric';
import { cardLikeOptions, cardRatio } from '../constants';

type LabelEditorProps = {
  file: File;
}

export const LabelEditor = ({ file }: LabelEditorProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  const padderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
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