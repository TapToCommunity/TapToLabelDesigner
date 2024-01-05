import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import type { Canvas } from 'fabric';
import { cardLikeOptions, cardRatio } from '../constants';
import { util } from 'fabric';
import { debounce } from '../utils';
import { setTemplateOnCanvases } from '../utils/setTemplate';
import { useAppDataContext } from '../contexts/appData';
import { colorsDiffer } from '../utils/utils';
import { updateColors } from '../utils/updateColors';

type LabelEditorProps = {
  file: File;
  canvasArrayRef: RefObject<Canvas[]>;
  index: number;
};

const resizerFunctionCreator = (fabricCanvas: Canvas): ResizeObserverCallback =>
  debounce<ResizeObserverCallback>((entries) => {
    const bbox = entries[0].contentRect;
    const chosenWidth = Math.floor(bbox.width - 20);
    fabricCanvas.setDimensions({
      width: chosenWidth,
      height: Math.ceil(chosenWidth / cardRatio),
    });
    const scale = util.findScaleToFit(cardLikeOptions, fabricCanvas);
    fabricCanvas.setZoom(scale);
  }, 10);

export const LabelEditor = ({
  file,
  canvasArrayRef,
  index,
}: LabelEditorProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const padderRef = useRef<HTMLDivElement | null>(null);
  const { template, customColors } = useAppDataContext();
  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
      if (canvasArrayRef.current) {
        canvasArrayRef.current[index] = fabricCanvas;
      }
      const callback = resizerFunctionCreator(fabricCanvas);
      setTemplateOnCanvases([fabricCanvas], template).then((colors) => {
        if (colorsDiffer(colors, customColors)) {
          updateColors([fabricCanvas], customColors, colors);
        }
      });
      const resizeObserver = new ResizeObserver(callback);
      resizeObserver.observe(divRef);
      return () => {
        resizeObserver.unobserve(divRef);
      };
    }
    // shouldn't retrigger for index change or template change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasArrayRef, fabricCanvas]);

  return (
    <div className="labelContainer" ref={padderRef}>
      <div className="labelPadder"></div>
      <FabricCanvasWrapper
        key={`canvas_${file.name}`}
        setFabricCanvas={setFabricCanvas}
        file={file}
      />
    </div>
  );
};

export default LabelEditor;
