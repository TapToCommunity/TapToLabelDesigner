import { useEffect } from 'react';
import { useAppDataContext } from '../contexts/appData';
import { useFileDropperContext } from '../contexts/fileDropper';
import { setTemplateOnCanvases } from '../utils/setTemplate';

export const DataToCanvasReconciler = () => {
  const { cards } = useFileDropperContext();
  const { template, setOriginalColors, setCustomColors, setIsIdle } =
    useAppDataContext();

  // takes care of template change
  useEffect(() => {
    if (cards.current.length) {
      setIsIdle(false);
      setTemplateOnCanvases(cards.current, template).then((colors) => {
        setOriginalColors(colors);
        setCustomColors(colors);
        setIsIdle(true);
      });
    }
  }, [template, setCustomColors, cards, setOriginalColors, setIsIdle]);

  return null;
};
