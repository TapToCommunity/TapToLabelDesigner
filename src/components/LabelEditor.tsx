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
    if (fabricCanvas && padderRef.current) {
      const bbox = padderRef.current.getBoundingClientRect();
      const chosenWidth = Math.floor(bbox.width - 20);
      fabricCanvas.setDimensions({
        width: chosenWidth,
        height: Math.ceil(chosenWidth / cardRatio),
      });
      const scale = util.findScaleToFit(cardLikeOptions, fabricCanvas);
      fabricCanvas.setZoom(scale);
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas]);

  return (
    <div className="labelContainer">
      <div className="labelPadder" ref={padderRef}></div>
      <FabricCanvasWrapper
        setFabricCanvas={setFabricCanvas}
        file={file} 
      />
    </div>
  );
}