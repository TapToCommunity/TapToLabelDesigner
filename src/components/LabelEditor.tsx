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

type MenuInfo = {
  open: boolean;
  top: number | string;
  left: number | string;
};

export const LabelEditor = ({ index, className, card }: LabelEditorProps) => {
  const [isMenuOpen, setMenuOpen] = useState<MenuInfo>({
    open: false,
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
    const bbox = divRef.getBoundingClientRect();
    setMenuOpen({
      open: true,
      left: `${(100 * (bbox.left + bbox.width / 2)) / window.innerWidth}%`,
      top: bbox.top + bbox.height / 2 + window.scrollY,
    });
  }, [setMenuOpen]);

  return (
    <div className={className} ref={padderRef} onClick={openMenu}>
      <FabricCanvasWrapper setFabricCanvas={setFabricCanvas} />
      {isMenuOpen.open && (
        <PortalMenu
          rotateMainImage={rotateMainImage}
          deleteLabel={deleteLabel}
          top={isMenuOpen.top}
          left={isMenuOpen.left}
          localColors={localColors}
          setLocalColors={setLocalColors}
          setLocaltemplate={setLocalTemplate}
          localTemplate={localTemplate}
          setIsOpen={setMenuOpen}
        />
      )}
    </div>
  );
};
