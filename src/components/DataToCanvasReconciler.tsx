import { useEffect } from 'react';
import { useAppDataContext } from '../contexts/appData';
import { CardData, useFileDropperContext } from '../contexts/fileDropper';
import { setTemplateOnCanvases } from '../utils/setTemplate';
import { updateColors } from '../utils/updateColors';
import { type StaticCanvas } from 'fabric';

export const DataToCanvasReconciler = () => {
  const { cards } = useFileDropperContext();
  const {
    template,
    setOriginalColors,
    setCustomColors,
    setIsIdle,
    customColors,
    originalColors,
  } = useAppDataContext();

  // takes care of template change
  useEffect(() => {
    if (cards.current.length) {
      setIsIdle(false);
      const selectedCards = cards.current.filter((card) => card.isSelected);
      setTemplateOnCanvases(selectedCards, template).then((colors) => {
        setOriginalColors(colors);
        setCustomColors(colors);
        setIsIdle(true);
      });
    }
  }, [template, setCustomColors, cards, setOriginalColors, setIsIdle]);

  useEffect(() => {
    const selectedCanvases = cards.current
      .filter(
        (card): card is Required<CardData> =>
          !!card.isSelected && !!card.canvas,
      )
      .map<StaticCanvas>((card) => card.canvas);
    updateColors(selectedCanvases, customColors, originalColors);
  }, [cards, customColors, originalColors]);

  return null;
};
