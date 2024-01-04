import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import {
  type ReactEventHandler,
  lazy,
  startTransition,
  useCallback,
  useRef,
} from 'react';

const FilterDropdown = lazy(() => import('./FilterDropdown'));
const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));

export const Header = () => {
  const hiddenInput = useRef<HTMLInputElement>(null);

  const { files, setFiles, canvasArrayRef } = useFileDropperContext();

  const openInputFile = useCallback(() => {
    hiddenInput.current && hiddenInput.current.click();
  }, []);

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

  const hasFiles = !!files.length;

  return (
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
  );
};
