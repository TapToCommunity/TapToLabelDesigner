import { useEffect, useCallback, useState, MutableRefObject } from 'react';
import { type CardData, useFileDropperContext } from '../contexts/fileDropper';
import {
  scaleImageToOverlayArea,
  setTemplateOnCanvases,
} from '../utils/setTemplate';
import { util, FabricImage, type StaticCanvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';

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
  const { template, isIdle } =
    useAppDataContext();
  const [fabricCanvas, setFabricCanvas] = useState<StaticCanvas | null>(null);
  // local ready state, when template is loaded
  const [fullyReady, setFullyReady] = useState<boolean>(false);
  const [isImageReady, setImageReady] = useState<boolean>(false);

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
      card.canvas = fabricCanvas;
      card.template = template;
      setTemplateOnCanvases([card], template).then(() => {
        setFullyReady(true);
        fabricCanvas.requestRenderAll();
      });
    }
    // shouldn't retrigger for index change or template change or colors
    // the data reconciler does that
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, fabricCanvas, isImageReady]);


  return {
    fabricCanvas,
    deleteLabel,
    setFabricCanvas,
    rotateMainImage,
  };
};
