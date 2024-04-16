import { useFileDropperContext } from '../contexts/fileDropper';
import './Header.css';
import { Suspense, lazy, useCallback, useState, useTransition } from 'react';
import { useAppDataContext } from '../contexts/appData';
import logoUrl from '../assets/log.svg';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from './ResponsiveIconButton';
import Typography from '@mui/material/Typography';
import { useFileAdder } from '../hooks/useFileAdder';
import PrintIcon from '@mui/icons-material/Print';

const TemplateDropdown = lazy(() => import('./TemplateDropdown'));
const ColorChanger = lazy(() => import('./ColorChanger'));
const ImageSearch = lazy(() => import('./ImageSearch'));
const PrintModal = lazy(() => import('./PrintModal'));

export const Header = () => {
  const { selectedCardsCount, cards } = useFileDropperContext();
  const { originalColors, customColors, setCustomColors, template } =
    useAppDataContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const { inputElement, openInputFile } = useFileAdder();
  const [, startTransition] = useTransition();

  const closePrintModal = useCallback(() => {
    setPrintOpen(false);
  }, []);

  const openPrintModal = useCallback(() => {
    setPrintOpen(true);
  }, []);

  const hasSelectedCards = !!selectedCardsCount;
  const hasFiles = !!cards.current.length;
  let colorToDisplay = customColors;
  let originalColorsToUse = originalColors;
  let currentTemplate = template;
  if (hasSelectedCards) {
    const selectedCard = cards.current.find((card) => card.isSelected);
    if (selectedCard) {
      colorToDisplay = selectedCard.colors;
      originalColorsToUse = selectedCard.originalColors;
      currentTemplate = selectedCard.template!;
    }
  }
  return (
    <div className={`${hasFiles ? 'fullHeader' : 'emptyHeader'} topHeader`}>
      {(hasFiles || searchOpen) && (
        <ImageSearch open={searchOpen} setOpen={setSearchOpen} />
      )}
      {inputElement}
      <div className="spacedContent">
        <div className="content" style={{ columnGap: 10 }}>
          <img id="logo" src={logoUrl} />
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={openInputFile}
          >
            <AddCircleOutlineIcon />
            <Typography>&nbsp;Add files</Typography>
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => startTransition(() => setSearchOpen(true))}
          >
            <SearchIcon />
            <Typography>&nbsp;Search image</Typography>
          </Button>
        </div>
        <div className="content">
          {hasFiles && (
            <TemplateDropdown template={currentTemplate} id="header" />
          )}
        </div>
      </div>
      {hasFiles && (
        <div className="spacedContent">
          <div className="content">
            {
              <>
                <ColorChanger
                  setCustomColors={setCustomColors}
                  customColors={colorToDisplay}
                  originalColors={originalColorsToUse}
                />
                <Typography color="secondary">
                  {selectedCardsCount > 0
                    ? `Change colors and template of ${selectedCardsCount} selected
                  card(s)`
                    : `Colors and template for new cards`}
                </Typography>
              </>
            }
          </div>
          <div className="content">
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={openPrintModal}
            >
              <PrintIcon />
              <Typography>&nbsp;Print</Typography>
            </Button>
          </div>
        </div>
      )}
      <Suspense>
        {printOpen && <PrintModal onClose={closePrintModal} open={printOpen} />}
      </Suspense>
    </div>
  );
};
