import { useEffect } from 'react';
import { useAppDataContext } from '../contexts/appData';
import { useFileDropperContext } from '../contexts/fileDropper';
import { setTemplateOnCanvases } from '../utils/setTemplate';

export const DataToCanvasReconciler = () => {
  const { canvasArrayRef } = useFileDropperContext();
  const { template, setOriginalColors, setCustomColors } = useAppDataContext();

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

  return null;
};
