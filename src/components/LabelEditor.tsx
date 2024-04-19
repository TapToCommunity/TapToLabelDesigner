import { useRef, type MouseEvent, useTransition } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import { useLabelEditor } from '../hooks/useLabelEditor';
import { useFileDropperContext, type CardData } from '../contexts/fileDropper';
import Checkbox from '@mui/material/Checkbox';

type LabelEditorProps = {
  index: number;
  className: string;
  card: CardData;
};

export type MenuInfo = {
  open: boolean;
  top: number | string;
  left: number | string;
};

export const LabelEditor = ({ index, className, card }: LabelEditorProps) => {
  const { selectedCardsCount, setSelectedCardsCount } = useFileDropperContext();
  const [, startTransition] = useTransition();
  const padderRef = useRef<HTMLDivElement | null>(null);
  const { setFabricCanvas } = useLabelEditor({
    card,
    index,
    padderRef,
  });

  const isSelected = card.isSelected;

  return (
    <div
      className={`${className} ${isSelected ? 'card-selected' : ''}`}
      ref={padderRef}
    >
      <label htmlFor={card.key}>
        <FabricCanvasWrapper setFabricCanvas={setFabricCanvas} />
        <div className="floating-checkbox">
          <Checkbox
            color="secondary"
            id={card.key}
            checked={isSelected}
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              const isSelectedCheckbox = (e.target as HTMLInputElement).checked;
              card.isSelected = isSelectedCheckbox;
              startTransition(() => {
                setSelectedCardsCount(
                  isSelectedCheckbox
                    ? selectedCardsCount + 1
                    : selectedCardsCount - 1,
                );
              });
            }}
          />
        </div>
      </label>
    </div>
  );
};
