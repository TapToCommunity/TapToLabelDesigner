import { FabricImage, util, Point, type StaticCanvas, Shadow, loadSVGFromURL, Group, FabricObject, Color, Gradient, type Canvas, type SerializedGroupProps } from 'fabric';
import { cardLikeOptions, type templateType } from '../constants';

FabricObject.ownDefaults.objectCaching = false;

export const scaleImageToOverlayArea = (template: templateType, overlayImg: FabricObject, mainImage: FabricImage) => {
  const { overlay } = template;
  // scale the art to the designed area in the template. to fit
  // TODO: add option later for fit or cover
  const isRotated = mainImage.angle % 180 !== 0;
  const scaledTemplateOverlaySize =
    overlayImg._getTransformedDimensions();
  const pictureScaleToTemplate = util.findScaleToFit({ 
    width: isRotated ? mainImage.height : mainImage.width,
    height: isRotated ? mainImage.width : mainImage.height,
  },
  {
    width: scaledTemplateOverlaySize.x * overlay!.width,
    height: scaledTemplateOverlaySize.y * overlay!.height,
  });
  mainImage.set({
    scaleX: pictureScaleToTemplate,
    scaleY: pictureScaleToTemplate,
  });
  // get the top left corner of the template overlay
  const templatePostion = overlayImg.translateToGivenOrigin(
    overlayImg.getRelativeXY(),
    'center',
    'center',
    'left',
    'top',
  );
  mainImage.setPositionByOrigin(
    new Point(
      scaledTemplateOverlaySize.x *
        (overlay!.x + overlay!.width / 2) +
        templatePostion.x,
      scaledTemplateOverlaySize.y *
        (overlay!.y + overlay!.height / 2) +
        templatePostion.y,
    ),
    'center',
    'center',
  );
}


/**
 * extract and normalizes to hex format colors in the objects
 * remove opacity from colors and sets it on the objects
 * @param group 
 */
// TODO: supports gradients and objects with different opacity
const extractUniqueColorsFromGroup = (group: Group): string[] => {
  const colors: string[] = [];
  group.forEachObject((object) => {
    (['stroke', 'fill'] as const).forEach((property) => {
      if (object[property] && !(object[property] as Gradient<'linear'>).colorStops) {
        const colorInstance = new Color(object[property] as string);
        const hexValue = `#${colorInstance.toHex()}`;
        const opacity = colorInstance.getAlpha();
        object[property] = hexValue;
        object.set({
          [property]: hexValue,
          [`original_${property}`]: hexValue,
        });
        object.opacity = opacity;
        if (!colors.includes(hexValue)) {
          colors.push(hexValue);
        }
      }
    });
  });
  return colors;
}

const parseSvg = (url: string): Promise<SerializedGroupProps> => 
  loadSVGFromURL(url).then(({ objects }) => {
    const nonNullObjects = objects.filter(objects => !!objects) as FabricObject[];
    const group = new Group(nonNullObjects);
    extractUniqueColorsFromGroup(group);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return group.toObject(['original_stroke', 'original_fill']);
  });

export const setTemplateOnCanvases = async (canvases: StaticCanvas[], template: templateType): Promise<string[]> => {
  const { overlay, background, shadow } = template || {};
  const [overlayImageSource, backgroundImageElement] = await Promise.all([
    overlay && (overlay.parsed ? overlay.parsed : (overlay.isSvg ? (overlay.parsed = parseSvg(overlay.url)) : (overlay.parsed = util.loadImage(overlay.url)))),
    background && (background.parsed ? background.parsed : (background.parsed = util.loadImage(background.url))) as unknown as HTMLImageElement,
  ]);
  const overlayImageElement = overlayImageSource && (overlayImageSource instanceof Image ? overlayImageSource : await Group.fromObject(overlayImageSource))
  for (const canvas of canvases ) {
    const mainImage = canvas.getObjects('image')[0] as FabricImage;
    mainImage.shadow = shadow ? new Shadow(shadow) : null;
    if (overlayImageElement) {
      // scale the overlay asset to cover the designed layer size
      // example: the template is supposed to be smaller than the card
      const scale = util.findScaleToCover(overlayImageElement, {
        width: overlay!.layerWidth,
        height: overlay!.layerHeight,
      });
      let overlayImg;
      if (overlayImageElement instanceof Group) {
        overlayImg = await Group.fromObject(overlayImageSource);
        overlayImg.canvas = canvas as Canvas;
      } else {
        overlayImg = new FabricImage(overlayImageElement, {
          canvas,
          scaleX: scale,
          scaleY: scale,
        });
      }
      canvas.overlayImage = overlayImg;
      // set the overlay of the template in the center of the card
      if (template?.layout === 'horizontal') {
        overlayImg.left = cardLikeOptions.width / 2;
        overlayImg.top = cardLikeOptions.height / 2;
      } else {
        overlayImg.left = cardLikeOptions.height / 2;
        overlayImg.top = cardLikeOptions.width / 2;
      }
      scaleImageToOverlayArea(template, overlayImg, mainImage)
    } else {
      // reset to BLANK
      canvas.overlayImage = undefined;
      const destination = template?.layout === 'horizontal' ? cardLikeOptions : {
        width: cardLikeOptions.height,
        height:  cardLikeOptions.width,
      }
      const pictureScale = util.findScaleToCover(
        mainImage,
        destination,
      );
      mainImage.set({
        scaleX: pictureScale,
        scaleY: pictureScale,
        left: destination.width / 2,
        top: destination.height / 2,
      });
    }
    if (backgroundImageElement) {
      // scale the overlay asset to cover the designed layer size
      // example: the template is supposed to be smaller than the card
      const scale = util.findScaleToFit(backgroundImageElement, {
        width: background!.layerWidth,
        height: background!.layerHeight,
      });
      const backgroundImg = new FabricImage(backgroundImageElement, {
        canvas,
        scaleX: scale,
        scaleY: scale,
      });
      canvas.backgroundImage = backgroundImg;
    } else {
      canvas.backgroundImage = canvas.clipPath;
    }
    const backgroundImg = canvas.backgroundImage!;
    if (template?.layout === 'horizontal') {
      backgroundImg.left = cardLikeOptions.width / 2;
      backgroundImg.top = cardLikeOptions.height / 2;
    } else {
      backgroundImg.left = cardLikeOptions.height / 2;
      backgroundImg.top = cardLikeOptions.width / 2;
    }
    const { clipPath } = canvas;
    if (clipPath) {
      if (template.layout === 'horizontal') {
        clipPath.left = cardLikeOptions.width / 2;
        clipPath.top = cardLikeOptions.height / 2;
        clipPath.angle = 0;
      } else {
        clipPath.top = cardLikeOptions.width / 2;
        clipPath.left = cardLikeOptions.height / 2;
        clipPath.angle = 90;
      }
      clipPath.setCoords();
    }

    canvas.requestRenderAll();
  }
  // this could returned by the promise right away
  let colors: string[] = [];
  if (overlayImageElement instanceof Group) {
    colors = extractUniqueColorsFromGroup(overlayImageElement);
  }
  return colors;
}