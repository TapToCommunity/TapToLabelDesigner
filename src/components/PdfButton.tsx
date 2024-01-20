import { useCallback } from 'react';
import type { JSX, RefObject } from 'react';
import type { Canvas } from 'fabric';
import { useAppDataContext } from '../contexts/appData';
import Button from '@mui/material/Button';
import { boxShadow } from '../constants';
import Typography from '@mui/material/Typography';
import PrintOutlined from '@mui/icons-material/PrintOutlined';
import { preparePdf } from '../utils/preparePdf';
import { prepareZip } from '../utils/prepareZip';

type PdfButtonProps = {
  canvasArrayRef: RefObject<Canvas[]>;
};

export const PdfButton = ({ canvasArrayRef }: PdfButtonProps): JSX.Element => {
  const { printerTemplate, template } = useAppDataContext();

  const prepareOutput = useCallback(async () => {
    console.log(printerTemplate.paperSize);
    if (printerTemplate.paperSize === 'zip') {
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
      <PrintOutlined />
      <Typography>&nbsp;Create PDF</Typography>
    </Button>
  );
};

export default PdfButton;
