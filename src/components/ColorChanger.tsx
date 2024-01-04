import { useAppDataContext } from '../contexts/appData';
import { ColorButton } from './ColorButton';

export const ColorChanger = () => {
  const { originalColors, customColors } = useAppDataContext();
  console.log(originalColors, customColors);
  return originalColors.map((color, index) => (
    <ColorButton
      key={color}
      color={customColors[index]}
      originalColor={color}
    />
  ));
};
