import { Group, type Canvas } from 'fabric';

export const updateColors = (canvases: Canvas[], colors: string[], originalColors: string[]) => {
  canvases.forEach((canvas) => {
    const overlayImage = canvas.overlayImage;
    if (overlayImage instanceof Group) {
      overlayImage.forEachObject((object) => {
        (['stroke', 'fill'] as const).forEach((property) => {
          if (object[property]) {
            const objectOriginalColor = object[`original_${property}` as keyof typeof object] as string;
            const originalIndex = originalColors.indexOf(objectOriginalColor);
            if (originalIndex > -1 && colors[originalIndex] !== objectOriginalColor) {
              object.set({
                [property]: colors[originalIndex],
              });
              canvas.requestRenderAll();
            }
          }
        });
      })
    }
  });
}