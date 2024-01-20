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
  ZipDownloader,
} from '../printTemplates';
const noop = () => {};

export type contextType = {
  isIdle: boolean;
  originalColors: string[];
  customColors: string[];
  template: templateType;
  templateKey: string;
  printerTemplate: PrintTemplate | ZipDownloader;
  printerTemplateKey: string;
  setOriginalColors: (colors: string[]) => void;
  setCustomColors: (colors: string[]) => void;
  setTemplate: (template: templateType) => void;
  setTemplateKey: (templateKey: string) => void;
  setPrinterTemplate: (template: PrintTemplate | ZipDownloader) => void;
  setPrinterTemplateKey: (templateKey: string) => void;
  setIsIdle: (value: boolean) => void;
};

export const defaultContextValue = {
  isIdle: false,
  setIsIdle: noop,
  originalColors: [],
  customColors: [],
  template: defaultTemplate,
  templateKey: defaultTemplateKey,
  printerTemplate: defaultPrinterTemplate,
  printerTemplateKey: defaultPrinterTemplateKey,
  setOriginalColors: noop,
  setCustomColors: noop,
  setTemplate: noop,
  setTemplateKey: noop,
  setPrinterTemplate: noop,
  setPrinterTemplateKey: noop,
};

export const AppDataContext = createContext<contextType>(defaultContextValue);

export const useAppDataContext = () => useContext(AppDataContext);