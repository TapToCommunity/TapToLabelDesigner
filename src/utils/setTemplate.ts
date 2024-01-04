import { FabricImage, util, Point, type Canvas, Shadow, loadSVGFromURL, Group, type FabricObject, Color } from 'fabric';
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
      if (object[property]) {
        const colorInstance = new Color(object[property] as string);
        const hexValue = `#${colorInstance.toHex()}`;
        const opacity = colorInstance.getAlpha();
        object[property] = hexValue;
        object.opacity = opacity;
        if (!colors.includes(hexValue)) {
          colors.push(hexValue);
        }
      }
    });
  });
  return colors;
}

export const setTemplateOnCanvases = async (canvases: Canvas[], template?: templateType): Promise<string[]> => {
  const { overlay, background, shadow } = template || {};
  const [overlayImageElement, backgroundImageElement] = await Promise.all([
    overlay && (overlay.isSvg ? parseSvg(overlay.url) : util.loadImage(overlay.url)),
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
      } else {
        overlayImg = new FabricImage(overlayImageElement, {
          canvas,
          scaleX: scale,
          scaleY: scale,
        });
      }
      canvas.overlayImage = overlayImg;
      // set the overlay of the template in the center of the card
      canvas.viewportCenterObject(overlayImg);
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
      canvas.viewportCenterObject(backgroundImg);
    } else {
      canvas.backgroundImage = canvas.clipPath;
    }
    canvas.requestRenderAll();
  }
  return colors;
}