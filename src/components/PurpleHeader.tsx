import DeleteIcon from '@mui/icons-material/Delete';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import IconButton from '@mui/material/IconButton';
import TemplateDropdown from './TemplateDropdown';
import ColorChanger from './ColorChanger';
import Typography from '@mui/material/Typography';
import { useFileDropperContext } from '../contexts/fileDropper';
import { useAppDataContext } from '../contexts/appData';

const PurpleHeader = () => {
  const { selectedCardsCount, cards } = useFileDropperContext();
  const { originalColors, customColors, setCustomColors, template } =
    useAppDataContext();
  const hasSelectedCards = !!selectedCardsCount;

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
    <div className={`topHeader purpleHeader ${hasSelectedCards ? 'show' : ''}`}>
      <div className="content">
        {
          <>
            <TemplateDropdown template={currentTemplate} id="header" />
            <ColorChanger
              setCustomColors={setCustomColors}
              customColors={colorToDisplay}
              originalColors={originalColorsToUse}
            />
            <Typography color="secondary">
              {`Apply on ${selectedCardsCount} selected card(s)`}
            </Typography>
            <div className="spacer" />
            <IconButton onClick={() => {}}>
              <Rotate90DegreesCwIcon />
            </IconButton>
            <div className="spacer" />
            <IconButton onClick={() => {}}>
              <DeleteIcon />
            </IconButton>
          </>
        }
      </div>
    </div>
  );
};

export default PurpleHeader;
