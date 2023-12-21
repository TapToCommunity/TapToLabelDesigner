import { createContext, useState, useEffect, DragEventHandler, DragEvent as ReactDragEvent } from 'react';
import type { FC, JSX } from 'react';
export const FileDropContext = createContext<File[]>([]);

const acceptDrag: DragEventHandler<HTMLDivElement> = (evt: ReactDragEvent<HTMLDivElement>) => evt.preventDefault();

type FileDropperProps = {
    children: JSX.Element | JSX.Element[];
};

export const FileDropper: FC<FileDropperProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
    
  useEffect(() => {
    const eventListener = (evt: DragEvent) => {
      evt.preventDefault();
      if (evt.dataTransfer && evt.dataTransfer.files) {
        setFiles([...files, ...evt.dataTransfer.files]);
      }
    }
    window.addEventListener('drop', eventListener);
    return () => {
      window.removeEventListener('drop', eventListener);
    }
  }, [setFiles, files]);

  return (
    <FileDropContext.Provider value={files}>
      <div onDragOver={acceptDrag}>
        {children}
      </div>
    </FileDropContext.Provider>
  );

};