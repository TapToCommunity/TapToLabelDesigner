import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type MouseEvent,
  useTransition,
} from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import { PortalMenu } from './PortalMenu';
import { useLabelEditor } from '../hooks/useLabelEditor';
import { useFileDropperContext, type CardData } from '../contexts/fileDropper';
import Checkbox from '@mui/material/Checkbox';
import { useFileDropper } from '../hooks/useFileDropper';

type LabelEditorProps = {
  index: number;
  className: string;
  card: CardData;
};

export type MenuInfo = {
  open: boolean;
  top: number | string;
  left: number | string;
  closedAt?: number;
};

export const LabelEditor = ({ index, className, card }: LabelEditorProps) => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [isSelected, setSelected] = useState<boolean>(false);
  const { selectedCardsCount, setSelectedCardsCount } = useFileDropperContext();
  const [, startTransition] = useTransition();
  const menuOpenData = useRef<MenuInfo>({
    open: true,
    top: 0,
    left: 0,
  });
  const padderRef = useRef<HTMLDivElement | null>(null);
  const {
    deleteLabel,
    setFabricCanvas,
    localColors,
    setLocalColors,
    rotateMainImage,
    localTemplate,
    setLocalTemplate,
  } = useLabelEditor({
    card,
    index,
    padderRef,
  });

  const openMenu = useCallback(() => {
    const divRef = padderRef.current!;
    const dataRef = menuOpenData.current;
    const bbox = divRef.getBoundingClientRect();
    if (!!dataRef.closedAt && dataRef.closedAt > Date.now() - 250) {
      return;
    }
    setMenuOpen(true);
    dataRef.left = `${
      (100 * (bbox.left + bbox.width / 2)) / window.innerWidth
    }%`;
    dataRef.top = bbox.top + bbox.height / 2 + window.scrollY;
    dataRef.closedAt = undefined;
  }, [setMenuOpen]);

  useEffect(() => {}, [isSelected]);

  return (
    <div
      className={`${className} ${isSelected ? 'card-selected' : ''}`}
      ref={padderRef}
      onClick={openMenu}
    >
      <FabricCanvasWrapper setFabricCanvas={setFabricCanvas} />
      {isMenuOpen && (
        <PortalMenu
          menuOpenData={menuOpenData.current}
          rotateMainImage={rotateMainImage}
          deleteLabel={deleteLabel}
          top={menuOpenData.current.top}
          left={menuOpenData.current.left}
          localColors={localColors}
          setLocalColors={setLocalColors}
          setLocalTemplate={setLocalTemplate}
          localTemplate={localTemplate}
          setIsOpen={setMenuOpen}
        />
      )}
      <div className="floating-checkbox">
        <Checkbox
          color="secondary"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            const isSelected = (e.target as HTMLInputElement).checked;
            setSelected(isSelected);
            startTransition(() => {
              setSelectedCardsCount(
                isSelected ? selectedCardsCount + 1 : selectedCardsCount - 1,
              );
            });
          }}
        />
      </div>
    </div>
  );
};
