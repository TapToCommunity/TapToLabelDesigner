import { useEffect, DragEventHandler, startTransition } from 'react';
import type { MutableRefObject, DragEvent as ReactDragEvent } from 'react';
import { useFileDropperContext } from '../contexts/fileDropper';

const acceptDrag: DragEventHandler<HTMLDivElement> = (
  evt: ReactDragEvent<HTMLDivElement>,
) => evt.preventDefault();

type useFileDropperParams = {
  elementRef: MutableRefObject<HTMLElement | null>;
};

export const useFileDropper = ({ elementRef }: useFileDropperParams) => {
  const { files, setFiles } = useFileDropperContext();

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    const eventListener = (evt: DragEvent) => {
      evt.preventDefault();
      startTransition(() => {
        if (evt.dataTransfer && evt.dataTransfer.files) {
          setFiles([...files, ...evt.dataTransfer.files]);
        }
      });
    };
    el.addEventListener('drop', eventListener);
    return () => {
      el.removeEventListener('drop', eventListener);
    };
  }, [setFiles, files, elementRef]);

  return {
    onDragOver: acceptDrag,
  };
};
