import { useState, useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import type { StaticCanvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';
import { PortalMenu } from './PortalMenu';
import { useLabelEditor } from '../hooks/useLabelEditor';

type LabelEditorProps = {
  file: File;
  canvasArrayRef: MutableRefObject<StaticCanvas[]>;
  index: number;
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
}: LabelEditorProps) => {
  const [isMenuOpen, setMenuOpen] = useState<MenuInfo>({
    open: false,
    top: 0,
    left: 0,
  });
  const padderRef = useRef<HTMLDivElement | null>(null);
  const { template } = useAppDataContext();
  const { deleteLabel, setFabricCanvas, localColors, setLocalColors } =
    useLabelEditor({
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
    <div
      className={`labelContainer ${template.layout}`}
      ref={padderRef}
      onClick={openMenu}
    >
      <FabricCanvasWrapper
        key={`canvas_${file.name}`}
        setFabricCanvas={setFabricCanvas}
        file={file}
      />
      {isMenuOpen.open && (
        <PortalMenu
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
