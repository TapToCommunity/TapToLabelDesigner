import { createContext, useContext } from 'react';
import {
  type templateType,
  defaultTemplate,
  defaultTemplateKey,
} from '../constants';
import {
  type PrintTemplate,
  defaultPrinterTemplate,
  defaultPrinterTemplateKey,
} from '../printTemplates';
const noop = () => {};

export type contextType = {
  originalColors: string[];
  customColors: string[];
  template: templateType;
  templateKey: string;
  printerTemplate: PrintTemplate;
  printerTemplateKey: string;
  setOriginalColors: (colors: string[]) => void;
  setCustomColors: (colors: string[]) => void;
  setTemplate: (template: templateType) => void;
  setTemplateKey: (templateKey: string) => void;
  setPrinterTemplate: (template: PrintTemplate) => void;
  setPrinterTemplateKey: (templateKey: string) => void;
};

export const defaultContextValue = {
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