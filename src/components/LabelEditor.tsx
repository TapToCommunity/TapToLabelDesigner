import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import type { Canvas } from 'fabric';
import {
  cardLikeOptions,
  cardRatio,
  type layoutOrientation,
} from '../constants';
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

const resizeFunction = (
  fabricCanvas: Canvas,
  orientation: layoutOrientation,
  bbox: DOMRectReadOnly,
) => {
  const chosenWidth = Math.floor(bbox.width - 20);
  const ratio = orientation === 'horizontal' ? cardRatio : 1 / cardRatio;
  fabricCanvas.setDimensions({
    width: chosenWidth,
    height: Math.ceil(chosenWidth / ratio),
  });
  let scale;
  if (orientation === 'horizontal') {
    scale = util.findScaleToFit(cardLikeOptions, fabricCanvas);
  } else {
    scale = util.findScaleToFit(
      {
        width: cardLikeOptions.height,
        height: cardLikeOptions.width,
      },
      fabricCanvas,
    );
  }
  fabricCanvas.setZoom(scale);
};

const resizerFunctionCreator = (
  fabricCanvas: Canvas,
  orientation: layoutOrientation,
): ResizeObserverCallback =>
  debounce<ResizeObserverCallback>((entries) => {
    const bbox = entries[0].contentRect;
    resizeFunction(fabricCanvas, orientation, bbox);
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
      setTemplateOnCanvases([fabricCanvas], template).then((colors) => {
        if (colorsDiffer(colors, customColors)) {
          updateColors([fabricCanvas], customColors, colors);
        }
      });
    }
    // shouldn't retrigger for index change or template change or colors
    // the data reconciler does that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasArrayRef, fabricCanvas]);

  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
      const callback = resizerFunctionCreator(fabricCanvas, template.layout);
      const resizeObserver = new ResizeObserver(callback);
      resizeObserver.observe(divRef);
      return () => {
        resizeObserver.unobserve(divRef);
      };
    }
  }, [template, fabricCanvas]);

  return (
    <div className={`labelContainer ${template.layout}`} ref={padderRef}>
      <div className={`labelPadder ${template.layout}`}></div>
      <FabricCanvasWrapper
        key={`canvas_${file.name}`}
        setFabricCanvas={setFabricCanvas}
        file={file}
      />
    </div>
  );
};
