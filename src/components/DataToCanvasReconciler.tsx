import { useEffect } from 'react';
import { useAppDataContext } from '../contexts/appData';
import { useFileDropperContext } from '../contexts/fileDropper';
import { setTemplateOnCanvases } from '../utils/setTemplate';
import { updateColors } from '../utils/updateColors';
import { colorsDiffer } from '../utils/utils';

export const DataToCanvasReconciler = () => {
  const { canvasArrayRef } = useFileDropperContext();
  const {
    template,
    setOriginalColors,
    originalColors,
    customColors,
    setCustomColors,
  } = useAppDataContext();

  // takes care of template change
  useEffect(() => {
    const canvases = canvasArrayRef.current;
    if (canvases) {
      setTemplateOnCanvases(canvases, template).then((colors) => {
        setOriginalColors(colors);
        setCustomColors(colors);
      });
    }
  }, [template, setCustomColors, canvasArrayRef, setOriginalColors]);

  // reconcile color changes
  useEffect(() => {
    const canvases = canvasArrayRef.current;

    if (canvases) {
      updateColors(canvases, customColors, originalColors);
    }
  }, [canvasArrayRef, customColors, originalColors]);

  useEffect(() => {});

  return null;
};
