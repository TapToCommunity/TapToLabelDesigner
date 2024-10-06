import { templateType } from "../resourcesTypedef";
import { StaticCanvas, FabricImage } from 'fabric';
import { setTemplateOnCanvases } from "./setTemplate";
import { CardData } from "../contexts/fileDropper";

export const prepareTemplateCarousel = async (templates: templateType[], img: HTMLImageElement): Promise<HTMLCanvasElement[]> => {
  const canvases = [];
  for (const template of templates) {
    const canvas = new StaticCanvas(undefined, {
      renderOnAddRemove: false,
      enableRetinaScaling: false,
      backgroundColor: 'white',
    });
    canvas.add((new FabricImage(img)))
    const card: CardData = {
      file: img,
      canvas,
      template,
      isSelected: false,
      colors: [],
      originalColors: [],
      key: 'x',
    }
    await setTemplateOnCanvases([card], template)
    canvases.push(canvas.lowerCanvasEl);
  }
  return canvases;
}