import { IconButton } from '@mui/material';
import { useAppDataContext } from '../contexts/appData';
import { ColorButtons } from './ColorButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export const ColorChanger = () => {
  const { originalColors, customColors, setCustomColors } = useAppDataContext();
  return (
    <>
      {originalColors.length > 0 && (
        <IconButton
          onClick={() => {
            setCustomColors(originalColors);
          }}
        >
          <RestartAltIcon />
        </IconButton>
      )}
      {originalColors.map((color, index) => (
        <ColorButtons
          key={color}
          color={customColors[index]}
          onClick={(color) => {
            const newColors = [...customColors];
            newColors[index] = color;
            setCustomColors(newColors);
          }}
        />
      ))}
    </>
  );
};
