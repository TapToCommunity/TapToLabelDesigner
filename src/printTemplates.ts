export type PrintTemplate = {
  gridSize: [number, number];
  label: string;
  rows: number;
  columns: number;
  leftMargin: number;
  topMargin: number;
  // set those if you go for auto-arrange
  rightMargin?: number;
  bottomMargin?: number;
  layout: 'portrait' | 'landscape';
  paperSize: [number, number]; // in mm
};

export const printTemplates: Record<string, PrintTemplate> = {
  a4Auto: {
    gridSize: [0, 0],
    label: 'A4, auto arrange',
    rows: 0,
    columns: 0,
    leftMargin: 10,
    topMargin: 3,
    bottomMargin: 3,
    rightMargin: 10,
    layout: 'landscape',
    paperSize: [297, 210],
  },
  horizontal: {
    gridSize: [90, 59],
    label: 'A4, Horizontal 3x3',
    rows: 3,
    columns: 3,
    leftMargin: 15,
    topMargin: 15,
    layout: 'landscape',
    paperSize: [297, 210],
  },
  vertical: {
    gridSize: [90, 56],
    label: 'A4, Vertical 2x5',
    rows: 5,
    columns: 2,
    leftMargin: 15,
    topMargin: 9,
    layout: 'portrait',
    paperSize: [210, 297],
  },
  horizontalLetter: {
    gridSize: [88, 59],
    label: 'Letter, Horizontal 3x3',
    rows: 3,
    columns: 3,
    leftMargin: 9,
    topMargin: 20,
    layout: 'landscape',
    paperSize: [279, 216],
  },
  verticalLetter: {
    gridSize: [90, 56],
    label: 'Letter, Vertical 2x4',
    rows: 4,
    columns: 2,
    leftMargin: 19,
    topMargin: 19,
    layout: 'portrait',
    paperSize: [216, 279],
  },
  inch8by10: {
    gridSize: [90, 56],
    label: ' 8 by 10 inches',
    rows: 4,
    columns: 2,
    leftMargin: 11,
    topMargin: 15,
    layout: 'portrait',
    paperSize: [203, 254],
  },
  a3v: {
    gridSize: [90, 56],
    label: 'A3 Horizontal',
    paperSize: [420, 297],
    columns: 4,
    rows: 5,
    leftMargin: 10,
    layout: 'landscape',
    topMargin: 10,
  },
  a3h: {
    gridSize: [90, 56],
    label: 'A3 Vertical',
    paperSize: [297, 420],
    rows: 7,
    columns: 3,
    leftMargin: 10,
    layout: 'portrait',
    topMargin: 10,
  }
};

export const defaultPrinterTemplateKey = 'horizontal';

export const defaultPrinterTemplate = printTemplates[defaultPrinterTemplateKey];
