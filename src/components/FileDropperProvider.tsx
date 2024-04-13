import { useState, useMemo, useCallback } from 'react';
import type { FC, JSX } from 'react';
import {
  type CardData,
  FileDropContext,
  type contextType,
} from '../contexts/fileDropper';

type FileDropperProps = {
  children: JSX.Element | JSX.Element[];
};

export const FileDropperContextProvider: FC<FileDropperProps> = ({
  children,
}) => {
  const [files, setFilesImpl] = useState<(File | HTMLImageElement)[]>([]);
  const [cards, setCards] = useState<CardData[]>([]);

  const addFiles = useCallback(
    (totalFiles: (File | HTMLImageElement)[]) => {
      let newFiles: (File | HTMLImageElement)[] = [];
      if (totalFiles.length > files.length) {
        newFiles = totalFiles.slice(files.length - totalFiles.length);
      }
      setFilesImpl(totalFiles);
      setCards([
        ...cards,
        ...newFiles.map<CardData>((file) => ({
          file,
          canvas: {
            current: undefined,
          },
          template: undefined,
        })),
      ]);
    },
    [files, cards],
  );

  const contextValue = useMemo<contextType>(
    () => ({
      files,
      setFiles: addFiles,
      cards,
    }),
    [files, addFiles, cards],
  );

  return (
    <FileDropContext.Provider value={contextValue}>
      {children}
    </FileDropContext.Provider>
  );
};
