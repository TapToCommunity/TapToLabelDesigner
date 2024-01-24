import { useState, useRef, useMemo } from 'react';
import type { Canvas } from 'fabric';
import type { FC, JSX } from 'react';
import { FileDropContext, type contextType } from '../contexts/fileDropper';

type FileDropperProps = {
  children: JSX.Element | JSX.Element[];
};

export const FileDropperContextProvider: FC<FileDropperProps> = ({
  children,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const canvasArrayRef = useRef<Canvas[]>([]);

  const contextValue = useMemo<contextType>(
    () => ({
      files,
      canvasArrayRef,
      setFiles,
    }),
    [files, setFiles],
  );

  return (
    <FileDropContext.Provider value={contextValue}>
      {children}
    </FileDropContext.Provider>
  );
};
