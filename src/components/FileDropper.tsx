import {
  createContext,
  useState,
  useEffect,
  DragEventHandler,
  useCallback,
  useRef,
  useMemo,
  lazy,
  startTransition,
} from 'react';
import type { Canvas } from 'fabric';
import type {
  FC,
  JSX,
  ReactEventHandler,
  DragEvent as ReactDragEvent,
  RefObject,
} from 'react';
import './FileDropper.css';

const FilterDropdown = lazy(() => import('./FilterDropdown'));
const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));

type contextType = {
  files: File[];
  canvasArrayRef: RefObject<Canvas[]>;
};

export const FileDropContext = createContext<contextType>({
  files: [],
  canvasArrayRef: {
    current: [],
  },
});

const acceptDrag: DragEventHandler<HTMLDivElement> = (
  evt: ReactDragEvent<HTMLDivElement>,
) => evt.preventDefault();

type FileDropperProps = {
  children: JSX.Element | JSX.Element[];
};

export const FileDropper: FC<FileDropperProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const hiddenInput = useRef<HTMLInputElement>(null);
  const canvasArrayRef = useRef<Canvas[]>([]);

  const contextValue = useMemo<contextType>(
    () => ({
      files,
      canvasArrayRef,
    }),
    [files],
  );

  const fileLoader = useCallback<ReactEventHandler<HTMLInputElement>>(
    (evt) => {
      const element = evt.currentTarget as HTMLInputElement;
      startTransition(() => {
        if (element.files) {
          setFiles([...files, ...element.files]);
        }
      });
    },
    [files],
  );

  const openInputFile = useCallback(() => {
    hiddenInput.current && hiddenInput.current.click();
  }, []);

  useEffect(() => {
    const eventListener = (evt: DragEvent) => {
      evt.preventDefault();
      startTransition(() => {
        if (evt.dataTransfer && evt.dataTransfer.files) {
          setFiles([...files, ...evt.dataTransfer.files]);
        }
      });
    };
    window.addEventListener('drop', eventListener);
    return () => {
      window.removeEventListener('drop', eventListener);
    };
  }, [setFiles, files]);

  const hasFiles = !!files.length;

  return (
    <FileDropContext.Provider value={contextValue}>
      <div className="topHeader">
        <input
          multiple
          ref={hiddenInput}
          type="file"
          onChange={fileLoader}
          style={{ display: 'none' }}
        />
        {hasFiles && <TemplateDropdown canvasArrayRef={canvasArrayRef} />}
        {hasFiles && <FilterDropdown canvasArrayRef={canvasArrayRef} />}
        <button onClick={openInputFile}>Add files</button>
        {hasFiles && <PdfButton canvasArrayRef={canvasArrayRef} />}
      </div>
      <div className="labelsContent" onDragOver={acceptDrag}>
        {children}
      </div>
    </FileDropContext.Provider>
  );
};
