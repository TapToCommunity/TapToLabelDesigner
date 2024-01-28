import type { MutableRefObject } from 'react';
import { createContext, useContext } from 'react';
import type { Canvas } from 'fabric';

export type contextType = {
  files: (File | HTMLImageElement)[];
  setFiles: (files: (File | HTMLImageElement)[]) => void;
  canvasArrayRef: MutableRefObject<Canvas[]>;
};

export const FileDropContext = createContext<contextType>({
  files: [],
  canvasArrayRef: {
    current: [],
  },
  setFiles: () => {},
});

export const useFileDropperContext = () => useContext(FileDropContext);
