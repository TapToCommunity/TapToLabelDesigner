import { createPortal } from 'react-dom';
import { ColorChanger } from './ColorChanger';
import DeleteIcon from '@mui/icons-material/Delete';
import Rotate90DegreesCwIcon from '@mui/icons-material/Rotate90DegreesCw';
import IconButton from '@mui/material/IconButton';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { useAppDataContext } from '../contexts/appData';
import './portalMenu.css';
import { templateType } from '../cardsTemplates';
import TemplateDropdown from './TemplateDropdown';

type PortalMenuType = {
  top: number | string;
  left: number | string;
  setIsOpen: (arg: { open: boolean; top: number; left: number }) => void;
  deleteLabel: () => void;
  setLocalColors: (colors: string[]) => void;
  localColors: string[];
  rotateMainImage: () => void;
  localTemplate: templateType;
  setLocalTemplate: (t: templateType) => void;
};

export const PortalMenu = ({
  top,
  left,
  setIsOpen,
  deleteLabel,
  setLocalColors,
  localColors,
  rotateMainImage,
  localTemplate,
  setLocalTemplate,
}: PortalMenuType) => {
  const { customColors, template } = useAppDataContext();
  return createPortal(
    <ClickAwayListener
      onClickAway={() => setIsOpen({ open: false, top: 0, left: 0 })}
    >
      <div
        className={`colorChangerContainer ${template.layout}`}
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
        <div className="spacer" />
        <IconButton onClick={rotateMainImage}>
          <Rotate90DegreesCwIcon />
        </IconButton>
        <div className="spacer" />
        <IconButton onClick={deleteLabel}>
          <DeleteIcon />
        </IconButton>
        <div className="spacer" />
        <TemplateDropdown />
      </div>
    </ClickAwayListener>,
    document.body,
  );
};
