import {
  StaticCanvas,
  Rect,
  Point
} from 'fabric';
import type { PrintOptions } from '../contexts/appData';
import { printTemplates } from '../printTemplates';
import { downloadBlob, fromMMtoPxAt72DPI } from './utils';
import { type CardData } from '../contexts/fileDropper';

export const generateCutShapes = async (printOptions: PrintOptions, cards: CardData[]) => {
  const { printerTemplateKey } = printOptions;
  const printerTemplate = printTemplates[printerTemplateKey];
  const { gridSize, leftMargin, topMargin, paperSize, columns, rows } = printerTemplate;

  const labelsPerPage = rows * columns;

  const numberOfCuts = Math.min(cards.length, labelsPerPage);
  const canvas = new StaticCanvas(undefined, {
    renderOnAddRemove: false,
  });


  canvas.setDimensions({
    width: fromMMtoPxAt72DPI(paperSize[0]),
    height: fromMMtoPxAt72DPI(paperSize[1]),
  });

  const borderRadius = fromMMtoPxAt72DPI(4)
  const width = fromMMtoPxAt72DPI(85);
  const height = fromMMtoPxAt72DPI(54);
  for (let index = 0; index < numberOfCuts; index++) {
    const column = index % columns;
    const row = Math.floor(index / columns) % rows;

    const xStart = fromMMtoPxAt72DPI(column * gridSize[0] + leftMargin);
    const yStart = fromMMtoPxAt72DPI(row * gridSize[1] + topMargin);
    const shape = new Rect({ width, height, fill: 'cyan', rx: borderRadius, ry: borderRadius });
    canvas.add(shape);
    shape.setPositionByOrigin(new Point(xStart, yStart), 'left', 'top');
  }

  const svg = canvas.toSVG({}, (a) => a);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, `${printerTemplate.label}.svg`);
}