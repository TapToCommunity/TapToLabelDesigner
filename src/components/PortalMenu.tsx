import { createPortal } from 'react-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import IconButton from '@mui/material/IconButton';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAppDataContext } from '../contexts/appData';
import './portalMenu.css';
import { MenuInfo } from './LabelEditor';

type PortalMenuType = {
  top: number | string;
  left: number | string;
  setIsOpen: (arg: boolean) => void;
  deleteLabel: () => void;
  rotateMainImage: () => void;
  menuOpenData: MenuInfo;
};

export const PortalMenu = ({
  top,
  left,
  setIsOpen,
  deleteLabel,
  rotateMainImage,
  menuOpenData,
}: PortalMenuType) => {
  const { template } = useAppDataContext();

  const onClickAway = () => {
    menuOpenData.closedAt = Date.now();
    setIsOpen(false);
  };

  return createPortal(
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={onClickAway}>
      <div
        className={`colorChangerContainer ${template.layout}`}
        style={{
          top,
          left,
        }}
      >
        <IconButton onClick={rotateMainImage}>
          <Rotate90DegreesCwIcon />
        </IconButton>
        <div className="spacer" />
        <IconButton onClick={deleteLabel}>
          <DeleteIcon />
        </IconButton>
      </div>
    </ClickAwayListener>,
    document.body,
  );
};
