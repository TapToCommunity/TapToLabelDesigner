import { useCallback, useRef, useState } from 'react';
import type { JSX, RefObject } from 'react';
import type { Canvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';
import { Button } from './ResponsiveIconButton';
import Typography from '@mui/material/Typography';
import PrintOutlined from '@mui/icons-material/PrintOutlined';
import PrintIcon from '@mui/icons-material/Print';
import FolderZipOutlined from '@mui/icons-material/FolderZipOutlined';

import { preparePdf as preparePdfVector } from '../utils/preparePdfKit';
import { preparePdf } from '../utils/preparePdf';
import { prepareZip } from '../utils/prepareZip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type labelInfo = {
  icon: JSX.Element;
  label: string;
};

const labels: labelInfo[] = [
  {
    icon: <PrintOutlined />,
    label: 'Create PDF',
  },
  {
    icon: <FolderZipOutlined />,
    label: 'Download Zip',
  },
  {
    icon: <PrintIcon />,
    label: 'new PDF [beta]',
  },
] as const;

const ChoiceButton = ({ onClick }: { onClick: (arg0: string) => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const anchorRef = useRef<HTMLElement>(null);
  const [label, setLabel] = useState<labelInfo>(labels[0]);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(anchorRef.current);
  };

  const handleClose = (label?: labelInfo) => {
    if (label) {
      setLabel(label);
      onClick(label.label);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={() => onClick(label.label)}
        endIcon={
          <span style={{ height: '24px' }} onClick={handleClick}>
            <KeyboardArrowDownIcon />
          </span>
        }
        variant="contained"
        size="large"
        color="primary"
        sx={{
          paddingLeft: '6px',
          paddingRight: '6px',
        }}
        ref={anchorRef}
      >
        {label.icon}
        <Typography>&nbsp;{label.label}</Typography>
      </Button>
      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          marginTop: 1,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
      >
        {labels.map((label) => (
          <MenuItem
            key={label.label}
            onClick={() => handleClose(label)}
            disableRipple
          >
            {label.icon}
            <Typography>&nbsp;{label.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

type PdfButtonProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

export const PdfButton = ({ canvasArrayRef }: PdfButtonProps): JSX.Element => {
  const { template, printOptions } = useAppDataContext();
  const prepareOutput = useCallback(
    async (currentLabel: string) => {
      if (currentLabel === labels[1].label) {
        await prepareZip(canvasArrayRef);
      } else if (currentLabel === labels[2].label) {
        preparePdfVector(printOptions, template, canvasArrayRef);
      } else {
        await preparePdf(printOptions, template, canvasArrayRef);
      }
    },
    [canvasArrayRef, printOptions, template],
  );

  return <ChoiceButton onClick={prepareOutput} />;
};

export default PdfButton;
