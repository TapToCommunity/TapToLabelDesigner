import { FabricImage, util, Point, type Canvas, Shadow, loadSVGFromURL, Group, type FabricObject } from 'fabric';
import { cardLikeOptions, type templateType } from '../constants';

export const parseSvg = (url: string): Promise<Group> => 
  loadSVGFromURL(url).then(({ objects }) => {
    const nonNullObjects = objects.filter(objects => !!objects) as FabricObject[];
    return new Group(nonNullObjects);
  });

export const setTemplateOnCanvases = (template: templateType, canvases: Canvas[]): void => {
  if (canvases) {
    const { overlay, background, shadow } = template || {};
    Promise.all([
      overlay && (overlay.isSvg ? parseSvg(overlay.url) : util.loadImage(overlay.url)),
      background && util.loadImage(background.url),
    ]).then(([overlayImageElement, backgroundImageElement]) => {
      canvases.forEach((canvas) => {
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
            overlayImg = overlayImageElement;
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
      });
    });
  }
}