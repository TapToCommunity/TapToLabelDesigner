import { useFileDropperContext } from '../contexts/fileDropper';
import {
  type ReactEventHandler,
  startTransition,
  useCallback,
  useRef,
} from 'react';

export const useFileAdder = () => {
  const hiddenInput = useRef<HTMLInputElement>(null);

  const { files, setFiles } = useFileDropperContext();

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

  const inputElement = (
    <input
      multiple
      ref={hiddenInput}
      type="file"
      onChange={fileLoader}
      style={{ display: 'none' }}
    />
  );

  return { inputElement, openInputFile };
};
