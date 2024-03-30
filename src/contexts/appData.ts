import { createContext, useContext } from 'react';
import {
  type templateType,
  defaultTemplate,
  defaultTemplateKey,
} from '../cardsTemplates';
import {
  type PrintTemplate,
  defaultPrinterTemplate,
  defaultPrinterTemplateKey,
} from '../printTemplates';
const noop = () => {};

type PrintOptions = {
  imageType: 'raster' | 'vector';
  printerTemplate: PrintTemplate;
  cutMarks: 'crop' | 'cut' | 'none',
  fileType: 'pdf' | 'zip';
};

export type contextType = {
  isIdle: boolean;
  originalColors: string[];
  customColors: string[];
  template: templateType;
  templateKey: string;
  printerTemplate: PrintTemplate;
  printerTemplateKey: string;
  printOptions: PrintOptions;
  setPrintOptions: (options: Partial<PrintOptions>) => void;
  setOriginalColors: (colors: string[]) => void;
  setCustomColors: (colors: string[]) => void;
  setTemplate: (template: templateType) => void;
  setTemplateKey: (templateKey: string) => void;
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
  templateKey: defaultTemplateKey,
  printerTemplate: defaultPrinterTemplate,
  printerTemplateKey: defaultPrinterTemplateKey,
  printOptions: {
    imageType: 'raster',
    fileType: 'pdf',
    cutMarks: 'none',
    printerTemplate: defaultPrinterTemplate,
  },
  setPrintOptions: noop,
  setOriginalColors: noop,
  setCustomColors: noop,
  setTemplate: noop,
  setTemplateKey: noop,
  setPrinterTemplate: noop,
  setPrinterTemplateKey: noop,
};

export const AppDataContext = createContext<contextType>(defaultContextValue);

export const useAppDataContext = () => useContext(AppDataContext);
