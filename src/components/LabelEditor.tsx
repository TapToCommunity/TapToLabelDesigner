import { useState, useRef, useCallback } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import { PortalMenu } from './PortalMenu';
import { useLabelEditor } from '../hooks/useLabelEditor';
import { type CardData } from '../contexts/fileDropper';

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

  return (
    <div className={className} ref={padderRef} onClick={openMenu}>
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
    </div>
  );
};
