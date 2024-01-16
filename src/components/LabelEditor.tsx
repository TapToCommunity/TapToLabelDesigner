import { useEffect, useState, useRef, useCallback } from 'react';
import type { MutableRefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import type { StaticCanvas } from 'fabric';
import {
  cardLikeOptions,
  cardRatio,
  type layoutOrientation,
} from '../constants';
import { util } from 'fabric';
import { throttle } from '../utils';
import { setTemplateOnCanvases } from '../utils/setTemplate';
import { useAppDataContext } from '../contexts/appData';
import { colorsDiffer } from '../utils/utils';
import { updateColors } from '../utils/updateColors';
import { useFileDropperContext } from '../contexts/fileDropper';
import { PortalMenu } from './PortalMenu';

type LabelEditorProps = {
  file: File;
  canvasArrayRef: MutableRefObject<StaticCanvas[]>;
  index: number;
};

type MenuInfo = {
  open: boolean;
  top: number;
  left: number;
};

const resizeFunction = (
  fabricCanvas: StaticCanvas,
  orientation: layoutOrientation,
  bbox: DOMRectReadOnly,
) => {
  if (fabricCanvas.disposed) {
    console.warn(
      'canvas disposed quickly you should not see this in production',
    );
    return;
  }
  const chosenWidth = Math.floor(bbox.width - 20);
  const ratio = orientation === 'horizontal' ? cardRatio : 1 / cardRatio;
  fabricCanvas.setDimensions({
    width: chosenWidth,
    height: Math.ceil(chosenWidth / ratio),
  });
  let scale;
  if (orientation === 'horizontal') {
    scale = util.findScaleToFit(cardLikeOptions, fabricCanvas);
  } else {
    scale = util.findScaleToFit(
      {
        width: cardLikeOptions.height,
        height: cardLikeOptions.width,
      },
      fabricCanvas,
    );
  }
  fabricCanvas.setZoom(scale);
};

const resizerFunctionCreator = (
  fabricCanvas: StaticCanvas,
  orientation: layoutOrientation,
): ResizeObserverCallback =>
  throttle<ResizeObserverCallback>((entries) => {
    const bbox = entries[0].contentRect;
    resizeFunction(fabricCanvas, orientation, bbox);
  }, 33);

export const LabelEditor = ({
  file,
  canvasArrayRef,
  index,
}: LabelEditorProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<StaticCanvas | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<MenuInfo>({
    open: false,
    top: 0,
    left: 0,
  });
  const padderRef = useRef<HTMLDivElement | null>(null);
  const { template, customColors, originalColors, isIdle } =
    useAppDataContext();

  const [localColors, setLocalColors] = useState<string[]>(customColors);

  const { setFiles, files } = useFileDropperContext();

  const openMenu = useCallback(() => {
    const divRef = padderRef.current!;
    const bbox = divRef.getBoundingClientRect();
    setMenuOpen({
      open: true,
      left: bbox.left + bbox.width / 2,
      top: bbox.top + bbox.height / 2 + window.scrollY,
    });
  }, [setMenuOpen]);

  const deleteLabel = useCallback(() => {
    if (canvasArrayRef.current) {
      canvasArrayRef.current = canvasArrayRef.current
        .slice(0, index)
        .concat(canvasArrayRef.current.slice(index + 1));
    }
    setFiles(files.slice(0, index).concat(files.slice(index + 1)));
  }, [canvasArrayRef, files, index, setFiles]);

  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
      if (canvasArrayRef.current) {
        canvasArrayRef.current[index] = fabricCanvas;
      }
      setTemplateOnCanvases([fabricCanvas], template).then((colors) => {
        setReady(true);
        if (colorsDiffer(colors, localColors)) {
          setLocalColors(colors);
        }
      });
    }
    // shouldn't retrigger for index change or template change or colors
    // the data reconciler does that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasArrayRef, fabricCanvas]);

  useEffect(() => {
    // every time customColors change reset the local
    isIdle && setLocalColors(customColors);
  }, [customColors, isIdle]);

  useEffect(() => {
    // every time local colors change update the canvas
    // only if we have colors in place
    // this could also be detected by inspecting the template
    if (
      isIdle &&
      fabricCanvas &&
      originalColors.length === localColors.length &&
      localColors.length
    ) {
      updateColors([fabricCanvas], localColors, originalColors);
    }
  }, [localColors, fabricCanvas, originalColors, isIdle]);

  useEffect(() => {
    const divRef = padderRef.current;
    // only start observing after mounting is complete.
    if (fabricCanvas && divRef && isIdle && ready) {
      const callback = resizerFunctionCreator(fabricCanvas, template.layout);
      const resizeObserver = new ResizeObserver(callback);
      resizeObserver.observe(divRef);
      return () => {
        resizeObserver.unobserve(divRef);
      };
    }
  }, [template, fabricCanvas, isIdle, ready]);

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
