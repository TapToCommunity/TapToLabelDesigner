export type PrintTemplate = {
  gridSize: [number, number];
  label: string;
  labelsPerPage: number;
  rows: number;
  columns: number;
  leftMargin: number;
  topMargin: number;
  layout: 'portrait' | 'landscape';
  paperSize: 'a4' | 'letter';
}

export type ZipDownloader = {
  label: string;
  paperSize: 'zip';
}

export const printTemplates: Record<string, PrintTemplate | ZipDownloader> = {
  horizontal: {
    gridSize: [90, 59],
    label: 'A4, Horizontal 3x3',
    labelsPerPage: 9,
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
    labelsPerPage: 10,
    rows: 5,
    columns: 2,
    leftMargin: 15,
    topMargin: 9,
    layout: 'portrait',
    paperSize: 'a4'
  },
  zip: {
    label: 'Images in a zip',
    paperSize: 'zip',
  }
};

export const defaultPrinterTemplateKey = 'horizontal';

export const defaultPrinterTemplate = printTemplates[defaultPrinterTemplateKey];