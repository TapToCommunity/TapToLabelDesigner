import { type MutableRefObject, useEffect } from "react";
import {
  cardLikeOptions,
  cardRatio,
} from '../constants';
import {   type layoutOrientation,
} from '../cardsTemplates';
import { util } from 'fabric';
import { throttle } from '../utils';
import type { StaticCanvas } from 'fabric';

const resizeFunction = (
  fabricCanvas: StaticCanvas,
  orientation: layoutOrientation,
  bbox: DOMRectReadOnly,
) => {
  if (fabricCanvas.disposed) {
    console.warn(
      'canvas disposed quickly you should not see this in production',
    );
    return;
  }
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
  fabricCanvas: StaticCanvas,
  orientation: layoutOrientation,
): ResizeObserverCallback =>
  throttle<ResizeObserverCallback>((entries) => {
    const bbox = entries[0].contentRect;
    resizeFunction(fabricCanvas, orientation, bbox);
  }, 33);

type useRealTimeResizeParams = {
  fabricCanvas: StaticCanvas | null;
  padderRef: MutableRefObject<HTMLDivElement | null>;
  ready: boolean;
  layout: 'vertical' | 'horizontal';
};

export const useRealTimeResize = ({ padderRef, fabricCanvas, ready, layout }: useRealTimeResizeParams) => {
  useEffect(() => {
    const divRef = padderRef.current;
    // only start observing after mounting is complete.
    if (fabricCanvas && divRef && ready) {
      const callback = resizerFunctionCreator(fabricCanvas, layout);
      const resizeObserver = new ResizeObserver(callback);
      resizeObserver.observe(divRef);
      return () => {
        resizeObserver.unobserve(divRef);
      };
    }
  }, [fabricCanvas, ready, padderRef, layout]);
}