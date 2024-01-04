import { createContext, useContext } from 'react';
import {
  type templateType,
  defaultTemplate,
  defaultTemplateKey,
} from '../constants';

const noop = () => {};

export type contextType = {
  originalColors: string[];
  customColors: string[];
  template?: templateType;
  templateKey: string;
  setOriginalColors: (colors: string[]) => void;
  setCustomColors: (colors: string[]) => void;
  setTemplate: (template: templateType) => void;
  setTemplateKey: (templateKey: string) => void;
};

export const defaultContextValue = {
  originalColors: [],
  customColors: [],
  template: defaultTemplate,
  templateKey: defaultTemplateKey,
  setOriginalColors: noop,
  setCustomColors: noop,
  setTemplate: noop,
  setTemplateKey: noop,
};

export const AppDataContext = createContext<contextType>(defaultContextValue);

export const useAppDataContext = () => useContext(AppDataContext);