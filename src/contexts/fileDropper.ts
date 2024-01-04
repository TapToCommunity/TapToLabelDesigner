import type {
  RefObject,
} from 'react';
import {
  createContext,
  useContext,
} from 'react';
import type { Canvas } from 'fabric';

export type contextType = {
  files: File[];
  setFiles: (files: File[]) => void;
  canvasArrayRef: RefObject<Canvas[]>;
};

export const FileDropContext = createContext<contextType>({
  files: [],
  canvasArrayRef: {
    current: [],
  },
  setFiles: () => {},
});

export const useFileDropperContext = () => useContext(FileDropContext)
