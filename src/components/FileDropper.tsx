import {
  createContext,
  useState,
  useEffect,
  DragEventHandler,
  useCallback,
  useRef,
  useMemo,
  lazy,
} from 'react';
import type { Canvas } from 'fabric';
import type { FC, JSX, ReactEventHandler, DragEvent as ReactDragEvent, RefObject } from 'react';
import './FileDropper.css';


const FilterDropdown = lazy(() => import('./FilterDropdown.tsx'));

type contextType = {
  files: File[];
  canvasArrayRef: RefObject<Canvas[]>;
}

export const FileDropContext = createContext<contextType>({
  files: [],
  canvasArrayRef: {
    current: [],
  },
});

const acceptDrag: DragEventHandler<HTMLDivElement> = (evt: ReactDragEvent<HTMLDivElement>) => evt.preventDefault();

type FileDropperProps = {
    children: JSX.Element | JSX.Element[];
};

export const FileDropper: FC<FileDropperProps> = ({ children }) => {
  const [files, setFiles] = useState<File[]>([]);
  const hiddenInput = useRef<HTMLInputElement>(null);
  const canvasArrayRef = useRef<Canvas[]>([]);

  const contextValue = useMemo<contextType>(() => ({
    files,
    canvasArrayRef,
  }), [files]);

  const fileLoader = useCallback<ReactEventHandler<HTMLInputElement>>((evt) => {
    const element = evt.currentTarget as HTMLInputElement;
    if (element.files) {
      setFiles([...files, ...element.files]);
    }
  }, [files]);

  const openInputFile = useCallback(() => {
    hiddenInput.current && hiddenInput.current.click();
  }, []);

  const preparePdf = useCallback(() => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16 // or "smart", default is 16
      });
      const canvases = canvasArrayRef.current;
      if (canvases) {
        let pageNumber = 0;
        canvases.map((canvas, index) => {
          const newPageNumber = Math.floor(index / 10);
          if (newPageNumber > pageNumber) {
            doc.addPage('a4', 'p');
            pageNumber = newPageNumber;
          }
          const column = index % 2;
          // reset rows every 5;
          const row = Math.floor(index / 2) % 5;
          doc.addImage(canvas.toDataURL(), 'PNG', column * 105 + 10, row * 59.4 + 2.5, 85.5, 54);
        });
      }
      doc.save("a4.pdf");
    });
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

  const hasFiles = !!files.length;

  return (
    <FileDropContext.Provider value={contextValue}>
      <div className="topHeader" >
        <input multiple ref={hiddenInput} type="file" onChange={fileLoader} style={{ display: 'none' }} />
        {hasFiles && <FilterDropdown canvasArrayRef={canvasArrayRef} />}
        <button onClick={openInputFile} >Add files</button>
        {hasFiles && <button onClick={preparePdf} >make PDF</button>}
      </div>
      <div className="labelsContent" onDragOver={acceptDrag}  >
        {children}
      </div>
    </FileDropContext.Provider>
  );
};