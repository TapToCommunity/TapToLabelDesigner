import { useEffect, useCallback, useState, MutableRefObject } from 'react';
import { colorsDiffer } from '../utils/utils';
import { updateColors } from '../utils/updateColors';
import { useFileDropperContext } from '../contexts/fileDropper';
import { scaleImageToOverlayArea, setTemplateOnCanvases } from '../utils/setTemplate';
import type { FabricImage, StaticCanvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';
import { useRealTimeResize } from './useRealtimeResize';

type useLabelEditorParams = {
  canvasArrayRef: MutableRefObject<StaticCanvas[]>;
  padderRef: MutableRefObject<HTMLDivElement | null>;
  index: number;
};

export const useLabelEditor = ({ canvasArrayRef, index, padderRef }: useLabelEditorParams) => {
  const { setFiles, files } = useFileDropperContext();
  const { template, customColors, originalColors, isIdle } =
    useAppDataContext();
  const [fabricCanvas, setFabricCanvas] = useState<StaticCanvas | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [localColors, setLocalColors] = useState<string[]>(customColors);

  const deleteLabel = useCallback(() => {
    if (canvasArrayRef.current) {
      canvasArrayRef.current = canvasArrayRef.current
        .slice(0, index)
        .concat(canvasArrayRef.current.slice(index + 1));
    }
    setFiles(files.slice(0, index).concat(files.slice(index + 1)));
  }, [canvasArrayRef, files, index, setFiles]);

  const rotateMainImage = useCallback(() => {
    if (ready && isIdle && fabricCanvas) {
      const mainImage = fabricCanvas.getObjects()[0] as FabricImage;
      mainImage.angle += 90;
      mainImage.angle %= 360;
      scaleImageToOverlayArea(template, fabricCanvas.overlayImage!, mainImage);
      fabricCanvas.requestRenderAll();
    }
  }, [ready, isIdle, fabricCanvas, template])

  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
      if (canvasArrayRef.current) {
        canvasArrayRef.current[index] = fabricCanvas;
      }
      setTemplateOnCanvases([fabricCanvas], template).then((colors) => {
        setReady(true);
        if (colorsDiffer(colors, localColors)) {
          setLocalColors(colors);
        }
      });
    }
    // shouldn't retrigger for index change or template change or colors
    // the data reconciler does that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasArrayRef, fabricCanvas]);

  useEffect(() => {
    // every time customColors change reset the local
    isIdle && setLocalColors(customColors);
  }, [customColors, isIdle]);

  useEffect(() => {
    // every time local colors change update the canvas
    // only if we have colors in place
    // this could also be detected by inspecting the template
    if (
      isIdle &&
      fabricCanvas &&
      originalColors.length === localColors.length &&
      localColors.length
    ) {
      updateColors([fabricCanvas], localColors, originalColors);
    }
  }, [localColors, fabricCanvas, originalColors, isIdle]);

  useRealTimeResize({ padderRef, ready: isIdle && ready, layout: template.layout, fabricCanvas });

  return {
    localColors,
    setLocalColors,
    deleteLabel,
    setFabricCanvas,
    rotateMainImage,
  }
}