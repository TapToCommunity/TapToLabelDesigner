import { useEffect, useCallback, useState, MutableRefObject } from 'react';
import { colorsDiffer } from '../utils/utils';
import { updateColors } from '../utils/updateColors';
import { type CardData, useFileDropperContext } from '../contexts/fileDropper';
import {
  scaleImageToOverlayArea,
  setTemplateOnCanvases,
} from '../utils/setTemplate';
import { util, FabricImage, type StaticCanvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';
import { type templateType } from '../cardsTemplates';

type useLabelEditorParams = {
  padderRef: MutableRefObject<HTMLDivElement | null>;
  index: number;
  card: CardData;
};

export const useLabelEditor = ({
  card,
  index,
  padderRef,
}: useLabelEditorParams) => {
  const { removeCard } = useFileDropperContext();
  const { template, customColors, originalColors, isIdle } =
    useAppDataContext();
  const [fabricCanvas, setFabricCanvas] = useState<StaticCanvas | null>(null);
  // local ready state, when template is loaded
  const [fullyReady, setFullyReady] = useState<boolean>(false);
  const [isImageReady, setImageReady] = useState<boolean>(false);
  const [localColors, setLocalColors] = useState<string[]>(customColors);
  const [localTemplate, setLocalTemplate] = useState<templateType>(template);

  const deleteLabel = useCallback(() => {
    removeCard(index);
  }, [removeCard, index]);

  const rotateMainImage = useCallback(() => {
    if (fullyReady && isIdle && fabricCanvas) {
      const mainImage = fabricCanvas.getObjects('image')[0] as FabricImage;
      mainImage.angle += 90;
      mainImage.angle %= 360;
      scaleImageToOverlayArea(template, fabricCanvas.overlayImage!, mainImage);
      fabricCanvas.requestRenderAll();
    }
  }, [fullyReady, isIdle, fabricCanvas, template]);

  useEffect(() => {
    if (fabricCanvas) {
      const { file } = card;
      const imagePromise =
        file instanceof Blob
          ? util.loadImage(URL.createObjectURL(file))
          : Promise.resolve(file);
      if (file) {
        const currentImage = fabricCanvas.getObjects('image')[0];
        if (currentImage) {
          fabricCanvas.remove(currentImage);
        }
        setImageReady(false);
        imagePromise.then((image) => {
          const fabricImage = new FabricImage(image);
          // @ts-expect-error no originalFile
          fabricImage.originalFile = file;
          const scale = util.findScaleToCover(fabricImage, fabricCanvas);
          fabricImage.scaleX = scale;
          fabricImage.scaleY = scale;
          fabricCanvas.add(fabricImage);
          fabricCanvas.centerObject(fabricImage);
          setImageReady(true);
        });
      }
    }
  }, [card, fabricCanvas]);

  useEffect(() => {
    const divRef = padderRef.current;
    if (fabricCanvas && divRef && isImageReady) {
      fabricCanvas.setDimensions(
        {
          width: 'var(--cell-width)' as unknown as number,
          height: 'auto' as unknown as number,
        },
        { cssOnly: true },
      );
      card.canvas.current = fabricCanvas;
      card.template = localTemplate;
      setTemplateOnCanvases([card], localTemplate).then((colors) => {
        setFullyReady(true);
        if (colorsDiffer(colors, localColors)) {
          setLocalColors(colors);
        }
        fabricCanvas.requestRenderAll();
      });
    }
    // shouldn't retrigger for index change or template change or colors
    // the data reconciler does that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, fabricCanvas, isImageReady]);

  useEffect(() => {
    console.log(card.template, localTemplate)
    if (fabricCanvas && fullyReady && card.template !== localTemplate) {
      card.template = localTemplate;
      setTemplateOnCanvases([card], localTemplate).then((colors) => {
        if (colorsDiffer(colors, localColors)) {
          setLocalColors(colors);
        }
        fabricCanvas.requestRenderAll();
      });
    }
  }, [localTemplate, fullyReady, fabricCanvas, card, localColors]);

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

  return {
    fabricCanvas,
    localColors,
    setLocalColors,
    deleteLabel,
    setFabricCanvas,
    rotateMainImage,
    localTemplate,
    setLocalTemplate,
  };
};
