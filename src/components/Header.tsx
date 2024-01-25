import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import {
  type ReactEventHandler,
  lazy,
  startTransition,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useAppDataContext } from '../contexts/appData';
import logoUrl from '../assets/log.svg';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { boxShadow } from '../constants';
import Stack from '@mui/material/Stack';
import { ImageSearch } from './ImageSearch';
import { useFileAdder } from '../hooks/useFileAdder';

const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));
const PrinterTemplateDropdown = lazy(() => import('./PrinterTemplateDropdown'));
const ColorChanger = lazy(() => import('./ColorChanger'));

export const Header = () => {
  const { files, canvasArrayRef } = useFileDropperContext();
  const { originalColors, customColors, setCustomColors } = useAppDataContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const { inputElement, openInputFile } = useFileAdder();

  const hasFiles = !!files.length;

  return (
    <div className="topHeader">
      <ImageSearch open={searchOpen} setOpen={setSearchOpen} />
      {inputElement}
      <div className="spacedContent">
        <div className="content">
          <Stack direction="row" spacing="10px">
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
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => setSearchOpen(true)}
              sx={{
                boxShadow,
                fontSize: '0.9375rem',
                textTransform: 'none',
              }}
            >
              <SearchIcon />
              <Typography>&nbsp;Search image</Typography>
            </Button>
          </Stack>
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
