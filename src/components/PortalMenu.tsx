import { createPortal } from 'react-dom';
import { ColorChanger } from './ColorChanger';
import DeleteIcon from '@mui/icons-material/Delete';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import IconButton from '@mui/material/IconButton';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAppDataContext } from '../contexts/appData';
import './portalMenu.css';

type PortalMenuType = {
  top: number | string;
  left: number | string;
  setIsOpen: (arg: { open: boolean; top: number; left: number }) => void;
  deleteLabel: () => void;
  setLocalColors: (colors: string[]) => void;
  localColors: string[];
  rotateMainImage: () => void;
};

export const PortalMenu = ({
  top,
  left,
  setIsOpen,
  deleteLabel,
  setLocalColors,
  localColors,
  rotateMainImage,
}: PortalMenuType) => {
  const { customColors } = useAppDataContext();
  return createPortal(
    <ClickAwayListener
      onClickAway={() => setIsOpen({ open: false, top: 0, left: 0 })}
    >
      <div
        className="colorChanger-container"
        style={{
          top,
          left,
        }}
      >
        <IconButton onClick={deleteLabel}>
          <DeleteIcon />
        </IconButton>
        <div className="spacer" />
        <ColorChanger
          originalColors={customColors}
          setCustomColors={setLocalColors}
          customColors={localColors}
        />
        <IconButton onClick={rotateMainImage}>
          <Rotate90DegreesCwIcon />
        </IconButton>
      </div>
    </ClickAwayListener>,
    document.body,
  );
};
