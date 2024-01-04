import { memo } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import './ColorButton.css';

type ColorButtonProps = {
  color: string;
  originalColor: string;
};

export const ColorButton = memo(
  ({ color, originalColor }: ColorButtonProps) => {
    return (
      <div
        className="colorButton"
        style={{ backgroundColor: color ?? originalColor }}
      >
        <ButtonBase style={{ width: '100%', height: '100%' }} />
      </div>
    );
  },
);
