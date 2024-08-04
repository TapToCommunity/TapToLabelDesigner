import {
  type FabricObject,
  type Canvas,
  type Group,
} from 'fabric';
import type { templateType } from '../resourcesTypedef';


const findById = (objects: (FabricObject | Group)[], id: string) => {
  objects.forEach((object) => {
    if(object.type === 'rect') {
      console.log({ object, id })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((object as any).id === id) {
      return object;
    }
    if ((object as Group).getObjects) {
      findById((object as Group).getObjects(), id);
    }
  })
}

export const processCustomizations = (canvas: Canvas, template: templateType) => {
  if (template.edits) {
    const { edits } = template;
    const objects = [...canvas.getObjects(), canvas.overlayImage, canvas.backgroundImage].filter((a) => !!a);
    edits.forEach(({ id, resource }) => {
      const fabricObject = findById(objects, id);
      console.log({ fabricObject })
    })
  }
}