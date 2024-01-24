import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import { lazy } from 'react';
import { useAppDataContext } from '../contexts/appData';
import logoUrl from '../assets/log.svg';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { boxShadow } from '../constants';
import { useFileAdder } from '../hooks/useFileAdder';

const PdfButton = lazy(() => import('./PdfButton'));
const TemplateDropdown = lazy(() => import('./TemplateDropdown'));
const PrinterTemplateDropdown = lazy(() => import('./PrinterTemplateDropdown'));
const ColorChanger = lazy(() => import('./ColorChanger'));

export const Header = () => {
  const { files, canvasArrayRef } = useFileDropperContext();
  const { originalColors, customColors, setCustomColors } = useAppDataContext();
  const { inputElement, openInputFile } = useFileAdder();

  const hasFiles = !!files.length;

  return (
    <div className="topHeader">
      {inputElement}
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
