import type { MutableRefObject } from 'react';
import { createContext, useContext } from 'react';
import type { StaticCanvas } from 'fabric';
import type { templateType } from '../cardsTemplates';

export type CardData = {
  file: File | HTMLImageElement,
  canvas: MutableRefObject<StaticCanvas | undefined>;
  template?: templateType;
}

export type contextType = {
  files: (File | HTMLImageElement)[];
  setFiles: (files: (File | HTMLImageElement)[]) => void;
  cards: CardData[];
};

export const FileDropContext = createContext<contextType>({
  files: [],
  cards: [],
  setFiles: () => {},
});

export const useFileDropperContext = () => useContext(FileDropContext);
