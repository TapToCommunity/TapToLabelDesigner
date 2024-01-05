import { memo, lazy, useState, Suspense, type ReactNode } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import './ColorButton.css';

const CompactColor = lazy(() => import('@uiw/react-color-compact'));

type ColorButtonProps = {
  onClick: (color: string) => void;
  color: string;
};

type ColorSwatchProps = {
  color: string;
  children?: ReactNode;
  className?: string;
  onClick: () => void;
};

const ColorSwatch = ({
  children,
  onClick,
  color,
  className = 'colorButton',
}: ColorSwatchProps) => {
  return (
    <div className={className} style={{ backgroundColor: color }}>
      <ButtonBase
        onClick={() => onClick()}
        style={{ width: '100%', height: '100%' }}
      />
      {children}
    </div>
  );
};

export const ColorButton = memo(({ color, onClick }: ColorButtonProps) => {
  const [open, setOpen] = useState(false);

  const colorChange = (color: string) => {
    onClick(color);
    setOpen(false);
  };

  return (
    <ColorSwatch onClick={() => setOpen(true)} color={color}>
      <Suspense fallback={null}>
        {open && (
          <CompactColor
            color={color}
            onChange={(color) => colorChange(color.hex)}
            style={{
              width: '296px',
              zIndex: 20,
              border: '1px solid grey',
              position: 'relative',
              backgroundColor: 'white',
              marginTop: '10px',
              paddingLeft: '8px',
              paddingTop: '8px',
            }}
            rectRender={({ color }) => (
              <ColorSwatch
                color={color}
                onClick={() => colorChange(color)}
                className="smallSwatch"
              />
            )}
          />
        )}
      </Suspense>
    </ColorSwatch>
  );
});
