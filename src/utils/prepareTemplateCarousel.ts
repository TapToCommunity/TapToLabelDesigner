import { templateType } from "../resourcesTypedef";
import { util, StaticCanvas, FabricImage } from 'fabric';
import { setTemplateOnCanvases } from "./setTemplate";
import { CardData } from "../contexts/fileDropper";

export const prepareTemplateCarousel = async (templates: templateType[], url: string): Promise<HTMLCanvasElement[]> => {
  const img = await util.loadImage(url);
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
    canvas.renderAll();
    canvases.push(canvas.lowerCanvasEl);
  }
  return canvases;
}