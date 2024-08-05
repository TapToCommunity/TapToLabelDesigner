import {
  type FabricObject,
  type Canvas,
  type Group,
  FabricImage,
  util,
} from 'fabric';
import type { templateType } from '../resourcesTypedef';


const findById = (objects: (FabricObject | Group)[], id: string): FabricObject | undefined => {
  let foundObject: FabricObject | undefined;
  for (const object of objects) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((object as any).id === id) {
      foundObject = object;
    }
    if ((object as Group).getObjects) {
      foundObject = findById((object as Group).getObjects(), id);
    }
    if (foundObject) {
      return foundObject;
    }
  }
}

export const processCustomizations = async (canvas: Canvas, template: templateType) => {
  if (template.edits) {
    const { edits } = template;
    const objects = [...canvas.getObjects(), canvas.overlayImage, canvas.backgroundImage].filter((a) => !!a);
    for (const { id, resource } of edits) {
      const fabricObject = findById(objects, id);
      if (fabricObject) {
        if (resource.type === 'image') {
          // load first value
          const image = await FabricImage.fromURL(resource.data[0].value);
          const insertTarget = fabricObject.parent || canvas;
          const insertObjects =  insertTarget.getObjects();
          const index = insertObjects.indexOf(fabricObject);
          insertTarget.insertAt(index + 1, image);
          const scale = util.findScaleToFit(image, fabricObject);
          const center = fabricObject.getRelativeCenterPoint();
          image.scale(scale);
          image.setPositionByOrigin(center, 'center', 'center');
          insertTarget.set('dirty', true);
          canvas.requestRenderAll();
        }
      }
    }
  }
}