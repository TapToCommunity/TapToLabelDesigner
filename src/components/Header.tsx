import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import { lazy, useState, useTransition } from 'react';
import { useAppDataContext } from '../contexts/appData';
import logoUrl from '../assets/log.svg';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from './ResponsiveIconButton';
import Typography from '@mui/material/Typography';
import { boxShadow } from '../constants';
import { useFileAdder } from '../hooks/useFileAdder';

const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));
const PrinterTemplateDropdown = lazy(() => import('./PrinterTemplateDropdown'));
const ColorChanger = lazy(() => import('./ColorChanger'));
const ImageSearch = lazy(() => import('./ImageSearch'));

export const Header = () => {
  const { files, canvasArrayRef } = useFileDropperContext();
  const { originalColors, customColors, setCustomColors } = useAppDataContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const { inputElement, openInputFile } = useFileAdder();
  const [, startTransition] = useTransition();

  const hasFiles = !!files.length;

  return (
    <div className={`${hasFiles ? 'fullHeader' : 'emptyHeader'} topHeader`}>
      {searchOpen && <ImageSearch open={searchOpen} setOpen={setSearchOpen} />}
      {inputElement}
      <div className="spacedContent">
        <div className="content" style={{ columnGap: 10 }}>
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
            onClick={() => startTransition(() => setSearchOpen(true))}
            sx={{
              boxShadow,
              fontSize: '0.9375rem',
              textTransform: 'none',
            }}
          >
            <SearchIcon />
            <Typography>&nbsp;Search image</Typography>
          </Button>
        </div>
        <div className="content">{hasFiles && <TemplateDropdown />}</div>
      </div>
      {hasFiles && (
        <div className="spacedContent">
          <div className="content">
            <ColorChanger
              setCustomColors={setCustomColors}
              customColors={customColors}
              originalColors={originalColors}
            />
          </div>
          <div className="content">
            <PrinterTemplateDropdown />
            <PdfButton canvasArrayRef={canvasArrayRef} />
          </div>
        </div>
      )}
    </div>
  );
};
