import { createContext, useContext } from 'react';
import {
  defaultTemplate,
} from '../cardsTemplates';
import type { templateType } from '../resourcesTypedef';
import {
  type PrintTemplate,
  defaultPrinterTemplate,
  defaultPrinterTemplateKey,
} from '../printTemplates';
import { noop } from '../utils/utils';

export type PrintOptions = {
  imageType: 'raster' | 'vector';
  printerTemplateKey: string;
  cutMarks: 'crop' | 'cut' | 'none',
  fileType: 'pdf' | 'zip';
};

export type contextType = {
  isIdle: boolean;
  originalColors: string[];
  customColors: string[];
  template: templateType;
  printerTemplate: PrintTemplate;
  printerTemplateKey: string;
  printOptions: PrintOptions;
  setPrintOptions: (options: Partial<PrintOptions>) => void;
  setOriginalColors: (colors: string[]) => void;
  setCustomColors: (colors: string[]) => void;
  setTemplate: (template: templateType) => void;
  setPrinterTemplate: (template: PrintTemplate) => void;
  setPrinterTemplateKey: (templateKey: string) => void;
  setIsIdle: (value: boolean) => void;
};

export const defaultContextValue: contextType = {
  isIdle: false,
  setIsIdle: noop,
  originalColors: [],
  customColors: [],
  template: defaultTemplate,
  printerTemplate: defaultPrinterTemplate,
  printerTemplateKey: defaultPrinterTemplateKey,
  printOptions: {
    imageType: 'raster',
    fileType: 'pdf',
    cutMarks: 'none',
    printerTemplateKey: defaultPrinterTemplateKey,
  },
  setPrintOptions: noop,
  setOriginalColors: noop,
  setCustomColors: noop,
  setTemplate: noop,
  setPrinterTemplate: noop,
  setPrinterTemplateKey: noop,
};

export const AppDataContext = createContext<contextType>(defaultContextValue);

export const useAppDataContext = () => useContext(AppDataContext);
