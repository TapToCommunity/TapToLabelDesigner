import { Group, type StaticCanvas } from 'fabric';

export const updateColors = (canvases: StaticCanvas[], colors: string[], originalColors: string[]) => {
  canvases.forEach((canvas) => {
    const { overlayImage, backgroundImage } = canvas;
    if (overlayImage instanceof Group) {
      overlayImage.forEachObject((object) => {
        (['stroke', 'fill'] as const).forEach((property) => {
          if (object[property]) {
            const objectOriginalColor = object[`original_${property}` as keyof typeof object] as string;
            const originalIndex = originalColors.indexOf(objectOriginalColor);
            if (originalIndex > -1 && colors[originalIndex] !== object[property]) {
              object.set({
                [property]: colors[originalIndex],
              });
              canvas.requestRenderAll();
            }
          }
        });
      })
    }
    if (backgroundImage instanceof Group) {
      backgroundImage.forEachObject((object) => {
        (['stroke', 'fill'] as const).forEach((property) => {
          if (object[property]) {
            const objectOriginalColor = object[`original_${property}` as keyof typeof object] as string;
            const originalIndex = originalColors.indexOf(objectOriginalColor);
            if (originalIndex > -1 && colors[originalIndex] !== object[property]) {
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