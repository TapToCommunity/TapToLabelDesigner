import { useState, useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import type { StaticCanvas } from 'fabric';
import { PortalMenu } from './PortalMenu';
import { useLabelEditor } from '../hooks/useLabelEditor';

type LabelEditorProps = {
  file: File | HTMLImageElement;
  canvasArrayRef: MutableRefObject<StaticCanvas[]>;
  index: number;
  className: string;
};

type MenuInfo = {
  open: boolean;
  top: number | string;
  left: number | string;
};

export const LabelEditor = ({
  file,
  canvasArrayRef,
  index,
  className,
}: LabelEditorProps) => {
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
  } = useLabelEditor({
    canvasArrayRef,
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
      <FabricCanvasWrapper
        key={`canvas_${(file as File).name || (file as HTMLImageElement).src}`}
        setFabricCanvas={setFabricCanvas}
        file={file}
      />
      {isMenuOpen.open && (
        <PortalMenu
          rotateMainImage={rotateMainImage}
          deleteLabel={deleteLabel}
          top={isMenuOpen.top}
          left={isMenuOpen.left}
          localColors={localColors}
          setLocalColors={setLocalColors}
          setIsOpen={setMenuOpen}
        />
      )}
    </div>
  );
};
