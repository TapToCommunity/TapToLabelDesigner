import { useEffect, DragEventHandler, startTransition } from 'react';
import type { FC, JSX, DragEvent as ReactDragEvent, ReactNode } from 'react';
import { useFileDropperContext } from '../contexts/fileDropper';
import './FileDropper.css';

const acceptDrag: DragEventHandler<HTMLDivElement> = (
  evt: ReactDragEvent<HTMLDivElement>,
) => evt.preventDefault();

type FileDropperProps = {
  children: JSX.Element | JSX.Element[] | ReactNode;
};

export const FileDropper: FC<FileDropperProps> = ({ children }) => {
  const { files, setFiles } = useFileDropperContext();

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

  return (
    <div className="labelsContent" onDragOver={acceptDrag}>
      {children}
    </div>
  );
};
