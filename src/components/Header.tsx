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
import logoUrl from '../assets/log.svg';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const FilterDropdown = lazy(() => import('./FilterDropdown'));
const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));
const PrinterTemplateDropdown = lazy(() => import('./PrinterTemplateDropdown'));

const boxShadow =
  '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)';

export const Header = () => {
  const hiddenInput = useRef<HTMLInputElement>(null);

  const { files, setFiles, canvasArrayRef } = useFileDropperContext();
  const { originalColors, customColors, setCustomColors } = useAppDataContext();

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
      <img id="logo" src={logoUrl} />
      <Button
        variant="contained"
        size="large"
        color="primary"
        onClick={openInputFile}
        sx={{
          boxShadow,
        }}
      >
        <AddCircleOutlineIcon />
        <Typography>&nbsp;Add files</Typography>
      </Button>
      {hasFiles && (
        <ColorChanger
          setCustomColors={setCustomColors}
          customColors={customColors}
          originalColors={originalColors}
        />
      )}
      {hasFiles && <TemplateDropdown />}
      {false && <FilterDropdown canvasArrayRef={canvasArrayRef} />}
      {hasFiles && <PrinterTemplateDropdown />}
      {hasFiles && <PdfButton canvasArrayRef={canvasArrayRef} />}
    </div>
  );
};
