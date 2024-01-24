export type PrintTemplate = {
  gridSize: [number, number];
  label: string;
  rows: number;
  columns: number;
  leftMargin: number;
  topMargin: number;
  layout: 'portrait' | 'landscape';
  paperSize: 'a4' | 'letter' | [number, number];
}

export type ZipDownloader = {
  label: string;
  paperSize: 'zip';
}

export const printTemplates: Record<string, PrintTemplate | ZipDownloader> = {
  horizontal: {
    gridSize: [90, 59],
    label: 'A4, Horizontal 3x3',
    rows: 3,
    columns: 3,
    leftMargin: 15,
    topMargin: 15,
    layout: 'landscape',
    paperSize: 'a4'
  }, 
  vertical: {
    gridSize: [90, 56],
    label: 'A4, Vertical 2x5',
    rows: 5,
    columns: 2,
    leftMargin: 15,
    topMargin: 9,
    layout: 'portrait',
    paperSize: 'a4'
  },
  printTest: {
    gridSize: [90, 56],
    label: '152cm adhesive vinyl',
    labelsPerPage: 10,
    rows: 26,
    columns: 16,
    leftMargin: 10,
    topMargin: 10,
    layout: 'landscape',
    paperSize: [1520, 1520]
  },
  zip: {
    label: 'Images in a Zip file',
    paperSize: 'zip',
  }
};

export const defaultPrinterTemplateKey = 'horizontal';

export const defaultPrinterTemplate = printTemplates[defaultPrinterTemplateKey];