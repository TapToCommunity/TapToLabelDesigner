import { useState, useMemo, useCallback, useRef } from 'react';
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
  const cards = useRef<CardData[]>([]);
  const [selectedCardsCount, setSelectedCardsCount] = useState<number>(0);

  const addFiles = useCallback(
    (totalFiles: (File | HTMLImageElement)[]) => {
      let newFiles: (File | HTMLImageElement)[] = [];
      if (totalFiles.length > files.length) {
        newFiles = totalFiles.slice(files.length - totalFiles.length);
      }
      setFilesImpl(totalFiles);
      cards.current.push(
        ...newFiles.map<CardData>((file) => ({
          file,
          canvas: undefined,
          template: undefined,
          isSelected: false,
          colors: [],
          originalColors: [],
        })),
      );
    },
    [files, cards],
  );

  const removeCard = useCallback(
    (index: number) => {
      if (cards.current[index].isSelected) {
        setSelectedCardsCount(selectedCardsCount - 1);
      }
      setFilesImpl([...files.slice(0, index), ...files.slice(index + 1)]);
      cards.current.splice(index, 1);
    },
    [files, selectedCardsCount],
  );

  const contextValue = useMemo<contextType>(
    () => ({
      files,
      setFiles: addFiles,
      cards,
      removeCard,
      selectedCardsCount,
      setSelectedCardsCount,
    }),
    [files, addFiles, removeCard, selectedCardsCount],
  );

  return (
    <FileDropContext.Provider value={contextValue}>
      {children}
    </FileDropContext.Provider>
  );
};
