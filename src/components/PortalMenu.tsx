import { createPortal } from 'react-dom';
import { ColorChanger } from './ColorChanger';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAppDataContext } from '../contexts/appData';
import './portalMenu.css';

type PortalMenuType = {
  top: number;
  left: number;
  setIsOpen: (arg: { open: boolean; top: number; left: number }) => void;
  deleteLabel: () => void;
  setLocalColors: (colors: string[]) => void;
  localColors: string[];
};

export const PortalMenu = ({
  top,
  left,
  setIsOpen,
  deleteLabel,
  setLocalColors,
  localColors,
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
        <ColorChanger
          originalColors={customColors}
          setCustomColors={setLocalColors}
          customColors={localColors}
        />
        <IconButton onClick={deleteLabel}>
          <DeleteIcon />
        </IconButton>
      </div>
    </ClickAwayListener>,
    document.body,
  );
};
