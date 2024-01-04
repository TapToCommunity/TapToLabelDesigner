import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import {
  type ReactEventHandler,
  lazy,
  startTransition,
  useCallback,
  useRef,
} from 'react';
import { ColorChanger } from './ColorChanger';
import { useAppDataContext } from '../contexts/appData';

const FilterDropdown = lazy(() => import('./FilterDropdown'));
const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));

export const Header = () => {
  const hiddenInput = useRef<HTMLInputElement>(null);

  const { files, setFiles, canvasArrayRef } = useFileDropperContext();
  const { templateKey } = useAppDataContext();

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
  const hasTemplate = templateKey !== 'blank';

  return (
    <div className="topHeader">
      <input
        multiple
        ref={hiddenInput}
        type="file"
        onChange={fileLoader}
        style={{ display: 'none' }}
      />
      {hasTemplate && <ColorChanger />}
      {hasFiles && <TemplateDropdown canvasArrayRef={canvasArrayRef} />}
      {hasFiles && <FilterDropdown canvasArrayRef={canvasArrayRef} />}
      <button onClick={openInputFile}>Add files</button>
      {hasFiles && <PdfButton canvasArrayRef={canvasArrayRef} />}
    </div>
  );
};
