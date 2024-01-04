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
      <ButtonBase>
        <div
          className="colorButton"
          style={{ backgroundColor: color ?? originalColor }}
        />
      </ButtonBase>
    );
  },
);
