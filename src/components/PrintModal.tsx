import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import './PrintModal.css';
import { type CardData, useFileDropperContext } from '../contexts/fileDropper';
import { type PrintOptions, useAppDataContext } from '../contexts/appData';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { printTemplates } from '../printTemplates';
import { prepareZip } from '../utils/prepareZip';
import { preparePdf as preparePdfVector } from '../utils/preparePdfKit';
import { preparePdf } from '../utils/preparePdf';
import type { templateType } from '../cardsTemplates';
import { generateCutShapes } from '../utils/generateCutShapes';
import type { RefObject } from 'react';
import type { Canvas } from 'fabric';

type PrintModalProps = {
  open: boolean;
  onClose: () => void;
};

const createOutput = async (
  cards: CardData[],
  printOptions: PrintOptions,
  template: templateType,
) => {
  if (printOptions.fileType === 'zip') {
    await prepareZip(cards);
  } else if (
    printOptions.fileType === 'pdf' &&
    printOptions.imageType === 'vector'
  ) {
    await preparePdfVector(printOptions, cards);
  } else {
    await preparePdf(
      printOptions,
      template,
      cards as unknown as RefObject<Canvas[]>,
    );
  }
  if (printOptions.cutMarks === 'cut') {
    await generateCutShapes(
      printOptions,
      template,
      cards as unknown as RefObject<Canvas[]>,
    );
  }
};

export const PrintModal = ({ open, onClose }: PrintModalProps) => {
  const { cards } = useFileDropperContext();
  const { printOptions, setPrintOptions, template } = useAppDataContext();
  const { fileType, imageType, cutMarks, printerTemplateKey } = printOptions;
  const isZip = fileType === 'zip';

  const basicButtonProps = {
    variant: 'contained',
    disabled: isZip,
    size: 'large',
  } as const;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="printModal">
        <Paper className="verticalStack modalContent">
          <IconButton onClick={onClose} className="closeIcon">
            <CloseIcon />
          </IconButton>
          <Typography variant="h1">Print options</Typography>
          {/* PDF OR ZIP */}
          <Typography width={'100%'}>
            You can download either a multipage PDF file or a ZIP file with all
            the labels inside.
          </Typography>
          <div className="horizontalStack">
            <Typography flexGrow="1">Type of download:</Typography>
            <Button
              onClick={() => setPrintOptions({ fileType: 'pdf' })}
              variant="contained"
              size="large"
              color={fileType === 'pdf' ? 'primary' : 'secondary'}
            >
              <Typography>PDF</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ fileType: 'zip' })}
              variant="contained"
              size="large"
              color={fileType === 'zip' ? 'primary' : 'secondary'}
            >
              <Typography>Zip File</Typography>
            </Button>
          </div>
          {/* VECTOR OR RASTER */}
          <Typography color={isZip ? 'dimgrey' : undefined}>
            The format of the labels can be of type 'vector' or 'raster'. Vector
            will preserve the quality of your images as is and provice a vector
            template around the image. Raster will make a new PNG that contains
            both the template and your image at 300DPI, the artwork for the
            labels will be rescaled at 300DPI but the quality will not improve
            if you have low resolution images. Vector will look nicer but will
            not support the faint shadow around the image.
          </Typography>
          <div className="horizontalStack">
            <Typography color={isZip ? 'dimgrey' : undefined} flexGrow="1">
              Type of ouput:
            </Typography>
            <Button
              onClick={() => setPrintOptions({ imageType: 'vector' })}
              {...basicButtonProps}
              color={imageType === 'vector' ? 'primary' : 'secondary'}
            >
              <Typography>Vector</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ imageType: 'raster' })}
              {...basicButtonProps}
              color={imageType === 'raster' ? 'primary' : 'secondary'}
            >
              <Typography>Raster</Typography>
            </Button>
          </div>
          {/* CUTTING MARKS */}
          <Typography color={isZip ? 'dimgrey' : undefined}>
            Add some cut helper on the print. 'crop' will provide tiny black
            lines near the labels to align a manual cutter. 'cut' will provide
            an outline for the labels for automatic cutters. This option is only
            for PDF output. WARNING: Cut shapes will trigger a double download
            one for the PDF and one for the stencil. The stencil is reusable but
            may change over time.
          </Typography>
          <div className="horizontalStack">
            <Typography color={isZip ? 'dimgrey' : undefined} flexGrow="1">
              Cutting marks:
            </Typography>
            <Button
              onClick={() => setPrintOptions({ cutMarks: 'crop' })}
              {...basicButtonProps}
              color={cutMarks === 'crop' ? 'primary' : 'secondary'}
            >
              <Typography>Crop marks</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ cutMarks: 'cut' })}
              {...basicButtonProps}
              color={cutMarks === 'cut' ? 'primary' : 'secondary'}
            >
              <Typography>Cutting shape</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ cutMarks: 'none' })}
              {...basicButtonProps}
              color={cutMarks === 'none' ? 'primary' : 'secondary'}
            >
              <Typography>None</Typography>
            </Button>
          </div>
          {/* Print size */}
          <div className="horizontalStack withMobileWrapping">
            <Typography flexGrow="1" color={isZip ? 'dimgrey' : undefined}>
              Page:
            </Typography>
            <div className="paperSizeContainer">
              {Object.entries(printTemplates).map(([key, template]) => {
                return (
                  <Button
                    key={key}
                    {...basicButtonProps}
                    onClick={() => setPrintOptions({ printerTemplateKey: key })}
                    color={key === printerTemplateKey ? 'primary' : 'secondary'}
                  >
                    <Typography textOverflow="ellipsis">
                      {template.label}
                    </Typography>
                  </Button>
                );
              })}
            </div>
          </div>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => createOutput(cards.current, printOptions, template)}
          >
            <Typography>Download</Typography>
          </Button>
        </Paper>
      </div>
    </Modal>
  );
};

export default PrintModal;
