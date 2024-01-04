import {
  useEffect,
  DragEventHandler,
  useCallback,
  useRef,
  lazy,
  startTransition,
} from 'react';
import type {
  FC,
  JSX,
  ReactEventHandler,
  DragEvent as ReactDragEvent,
  ReactNode,
} from 'react';
import { useFileDropperContext } from '../contexts/fileDropper';
import './FileDropper.css';

const FilterDropdown = lazy(() => import('./FilterDropdown'));
const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));

const acceptDrag: DragEventHandler<HTMLDivElement> = (
  evt: ReactDragEvent<HTMLDivElement>,
) => evt.preventDefault();

type FileDropperProps = {
  children: JSX.Element | JSX.Element[] | ReactNode;
};

export const FileDropper: FC<FileDropperProps> = ({ children }) => {
  const hiddenInput = useRef<HTMLInputElement>(null);

  const { files, setFiles, canvasArrayRef } = useFileDropperContext();

  const fileLoader = useCallback<ReactEventHandler<HTMLInputElement>>(
    (evt) => {
      const element = evt.currentTarget as HTMLInputElement;
      startTransition(() => {
        if (element.files) {
          setFiles([...files, ...element.files]);
        }
      });
    },
    [files, setFiles],
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
    <>
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
    </>
  );
};
