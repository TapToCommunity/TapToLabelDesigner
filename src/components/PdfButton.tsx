import { useCallback } from 'react';
import type { JSX, RefObject } from 'react';
import type { Canvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';
import { Button } from './ResponsiveIconButton';
import { boxShadow } from '../constants';
import Typography from '@mui/material/Typography';
import PrintOutlined from '@mui/icons-material/PrintOutlined';
import FolderZipOutlined from '@mui/icons-material/FolderZipOutlined';

import { preparePdf } from '../utils/preparePdf';
import { prepareZip } from '../utils/prepareZip';

type PdfButtonProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

export const PdfButton = ({ canvasArrayRef }: PdfButtonProps): JSX.Element => {
  const { printerTemplate, template } = useAppDataContext();
  const isZip = printerTemplate.paperSize === 'zip';
  const prepareOutput = useCallback(async () => {
    if (isZip) {
      await prepareZip(canvasArrayRef);
    } else {
      await preparePdf(printerTemplate, template, canvasArrayRef);
    }
  }, [printerTemplate, canvasArrayRef, template]);

  return (
    <Button
      variant="contained"
      size="large"
      color="primary"
      sx={{
        boxShadow,
        fontSize: '0.9375rem',
        textTransform: 'none',
      }}
      onClick={prepareOutput}
    >
      {isZip ? <FolderZipOutlined /> : <PrintOutlined />}
      <Typography>&nbsp;{isZip ? 'Download Zip' : 'Create PDF'}</Typography>
    </Button>
  );
};

export default PdfButton;
