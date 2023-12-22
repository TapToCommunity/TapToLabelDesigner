import {
  createContext,
  useState,
  useEffect,
  DragEventHandler,
  useCallback,
  useRef
} from 'react';
import type { FC, JSX, ReactEventHandler, DragEvent as ReactDragEvent } from 'react';
import './FileDropper.css';

export const FileDropContext = createContext<File[]>([]);

const acceptDrag: DragEventHandler<HTMLDivElement> = (evt: ReactDragEvent<HTMLDivElement>) => evt.preventDefault();

type FileDropperProps = {
    children: JSX.Element | JSX.Element[];
};

export const FileDropper: FC<FileDropperProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const hiddenInput = useRef<HTMLInputElement>(null);

  const fileLoader = useCallback<ReactEventHandler<HTMLInputElement>>((evt) => {
    const element = evt.currentTarget as HTMLInputElement;
    if (element.files) {
      setFiles([...files, ...element.files]);
    }
  }, [files]);

  const openInputFile = useCallback(() => {
    hiddenInput.current && hiddenInput.current.click();
  }, []);

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
      <div className="topHeader" >
        <input multiple ref={hiddenInput} type="file" onChange={fileLoader} style={{ display: 'none' }} />
        <button onClick={openInputFile} >Add files</button>
      </div>
      <div className="labelsContent" onDragOver={acceptDrag}  >
        {children}
      </div>
    </FileDropContext.Provider>
  );
};