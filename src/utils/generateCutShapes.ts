import {
  StaticCanvas,
  Rect,
  type Canvas,
  Point
} from 'fabric';
import type { PrintOptions } from '../contexts/appData';
import type { templateType } from '../cardsTemplates';
import type { RefObject } from 'react';
import { printTemplates } from '../printTemplates';
import { downloadBlob } from './utils';

export const generateCutShapes = async (printOptions: PrintOptions, _template: templateType, canvasArrayRef: RefObject<Canvas[]>) => {
  const { printerTemplateKey } = printOptions;
  const printerTemplate = printTemplates[printerTemplateKey];
  const { gridSize, leftMargin, topMargin, paperSize, columns, rows } = printerTemplate;

  const labelsPerPage = rows * columns;

  const numberOfCuts = Math.min(canvasArrayRef.current!.length, labelsPerPage);
  const canvas = new StaticCanvas(undefined, {
    renderOnAddRemove: false,
  });

  canvas.setDimensions({
    width: paperSize[0],
    height: paperSize[1],
  });

  for (let index = 0; index < numberOfCuts; index++) {
    const column = index % columns;
    const row = Math.floor(index / columns) % rows;

    const xStart = column * gridSize[0] + leftMargin;
    const yStart = row * gridSize[1] + topMargin;
    const width = 85;
    const height = 54;
    const shape = new Rect({ width, height, fill: 'cyan', rx: 4, ry: 4 });
    canvas.add(shape);
    shape.setPositionByOrigin(new Point(xStart, yStart), 'left', 'top');
  }
  const svg = canvas.toSVG({ width: `${paperSize[0]}mm`, height: `${paperSize[1]}mm` }, (a) => a);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, `${printerTemplate.label}.svg`);
}