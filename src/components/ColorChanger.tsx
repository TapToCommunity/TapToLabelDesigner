import { useAppDataContext } from '../contexts/appData';
import { ColorButton } from './ColorButton';

export const ColorChanger = () => {
  const { originalColors, customColors, setCustomColors } = useAppDataContext();
  return originalColors.map((color, index) => (
    <ColorButton
      key={color}
      color={customColors[index]}
      onClick={(color) => {
        const newColors = [...customColors];
        newColors[index] = color;
        setCustomColors(newColors);
      }}
    />
  ));
};
