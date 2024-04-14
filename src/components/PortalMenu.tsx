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
import { MenuInfo } from './LabelEditor';

type PortalMenuType = {
  top: number | string;
  left: number | string;
  setIsOpen: (arg: boolean) => void;
  deleteLabel: () => void;
  setLocalColors: (colors: string[]) => void;
  localColors: string[];
  rotateMainImage: () => void;
  localTemplate: templateType;
  setLocalTemplate: (t: templateType) => void;
  menuOpenData: MenuInfo;
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
  menuOpenData,
}: PortalMenuType) => {
  const { customColors, template } = useAppDataContext();

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
        <TemplateDropdown
          id="portalmenu"
          localTemplate={localTemplate}
          setLocalTemplate={setLocalTemplate}
        />
      </div>
    </ClickAwayListener>,
    document.body,
  );
};
