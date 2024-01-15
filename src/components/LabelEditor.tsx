import { useEffect, useState, useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import './LabelEditor.css';
import type { StaticCanvas } from 'fabric';
import {
  cardLikeOptions,
  cardRatio,
  type layoutOrientation,
} from '../constants';
import { util } from 'fabric';
import { debounce } from '../utils';
import { setTemplateOnCanvases } from '../utils/setTemplate';
import { useAppDataContext } from '../contexts/appData';
import { colorsDiffer } from '../utils/utils';
import { updateColors } from '../utils/updateColors';
import { ColorChanger } from './ColorChanger';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useFileDropperContext } from '../contexts/fileDropper';

type LabelEditorProps = {
  file: File;
  canvasArrayRef: RefObject<StaticCanvas[]>;
  index: number;
};

const resizeFunction = (
  fabricCanvas: StaticCanvas,
  orientation: layoutOrientation,
  bbox: DOMRectReadOnly,
) => {
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
  debounce<ResizeObserverCallback>((entries) => {
    const bbox = entries[0].contentRect;
    resizeFunction(fabricCanvas, orientation, bbox);
  }, 10);

export const LabelEditor = ({
  file,
  canvasArrayRef,
  index,
}: LabelEditorProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<StaticCanvas | null>(null);
  const padderRef = useRef<HTMLDivElement | null>(null);
  const { template, customColors, originalColors } = useAppDataContext();

  const [localColors, setLocalColors] = useState<string[]>(customColors);

  const { setFiles, files } = useFileDropperContext();

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
    setLocalColors(customColors);
  }, [customColors]);

  useEffect(() => {
    // every time local colors change update the canvas
    // only if we have colors in place
    // this could also be detected by inspecting the template
    if (
      fabricCanvas &&
      originalColors.length === localColors.length &&
      localColors.length
    ) {
      updateColors([fabricCanvas], localColors, originalColors);
    }
  }, [localColors, fabricCanvas, originalColors]);

  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef) {
      const callback = resizerFunctionCreator(fabricCanvas, template.layout);
      const resizeObserver = new ResizeObserver(callback);
      resizeObserver.observe(divRef);
      return () => {
        resizeObserver.unobserve(divRef);
      };
    }
  }, [template, fabricCanvas]);

  return (
    <div className={`labelContainer ${template.layout}`} ref={padderRef}>
      <FabricCanvasWrapper
        key={`canvas_${file.name}`}
        setFabricCanvas={setFabricCanvas}
        file={file}
      />
      <div className="colorChanger-container">
        <ColorChanger
          originalColors={customColors}
          setCustomColors={setLocalColors}
          customColors={localColors}
        />
        <IconButton
          onClick={() => {
            deleteLabel();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};
