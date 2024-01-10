import { FabricImage, util, Point, type StaticCanvas, Shadow, loadSVGFromURL, Group, type FabricObject, Color, Gradient, type Canvas } from 'fabric';
import { cardLikeOptions, type templateType } from '../constants';

const parseSvg = (url: string): Promise<Group> => 
  loadSVGFromURL(url).then(({ objects }) => {
    const nonNullObjects = objects.filter(objects => !!objects) as FabricObject[];
    return new Group(nonNullObjects);
  });

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

export const setTemplateOnCanvases = async (canvases: StaticCanvas[], template: templateType): Promise<string[]> => {
  const { overlay, background, shadow } = template || {};
  const [overlayImageElement, backgroundImageElement] = await Promise.all([
    overlay && (overlay.isSvg 
      ? overlay.parsed ?? (overlay.parsed = parseSvg(overlay.url)) 
      : util.loadImage(overlay.url)
    ),
    background && util.loadImage(background.url),
  ]);
  let colors: string[] = [];
  if (overlayImageElement instanceof Group) {
    colors = extractUniqueColorsFromGroup(overlayImageElement);
  }
  for (const canvas of canvases ) {
    const mainImage = canvas.getObjects('image')[0];
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
        overlayImg = await overlayImageElement.clone();
        extractUniqueColorsFromGroup(overlayImg);
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
      // scale the art to the designed area in the template. to fit
      // TODO: add option later for fit or cover
      const scaledTemplateOverlaySize =
        overlayImg._getTransformedDimensions();
      const pictureScaleToTemplate = util.findScaleToFit(mainImage, {
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
    } else {
      // reset to BLANK
      canvas.overlayImage = undefined;
      const pictureScale = util.findScaleToCover(
        mainImage,
        cardLikeOptions,
      );
      mainImage.set({
        scaleX: pictureScale,
        scaleY: pictureScale,
      });
      mainImage.setPositionByOrigin(new Point(0, 0), 'left', 'top');
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
      if (template?.layout === 'horizontal') {
        backgroundImg.left = cardLikeOptions.width / 2;
        backgroundImg.top = cardLikeOptions.height / 2;
      } else {
        backgroundImg.left = cardLikeOptions.height / 2;
        backgroundImg.top = cardLikeOptions.width / 2;
      }
    } else {
      canvas.backgroundImage = canvas.clipPath;
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
    }

    canvas.requestRenderAll();
  }
  return colors;
}