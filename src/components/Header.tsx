import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import {
  type ReactEventHandler,
  lazy,
  startTransition,
  useCallback,
  useRef,
} from 'react';
import { useAppDataContext } from '../contexts/appData';
import logoUrl from '../assets/log.svg';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { boxShadow } from '../constants';

const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));
const PrinterTemplateDropdown = lazy(() => import('./PrinterTemplateDropdown'));
const ColorChanger = lazy(() => import('./ColorChanger'));

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
      <div className="spacedContent">
        <div className="content">
          <img id="logo" src={logoUrl} />
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={openInputFile}
            sx={{
              boxShadow,
              fontSize: '0.9375rem',
              textTransform: 'none',
            }}
          >
            <AddCircleOutlineIcon />
            <Typography>&nbsp;Add files</Typography>
          </Button>
        </div>
        <div className="content">{hasFiles && <TemplateDropdown />}</div>
      </div>
      <div className="spacedContent">
        <div className="content">
          {hasFiles && (
            <ColorChanger
              setCustomColors={setCustomColors}
              customColors={customColors}
              originalColors={originalColors}
            />
          )}
        </div>
        <div className="content">
          {hasFiles && (
            <>
              <PrinterTemplateDropdown />
              <PdfButton canvasArrayRef={canvasArrayRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
