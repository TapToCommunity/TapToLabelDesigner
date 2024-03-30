import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import PdfButton from './PdfButton';
import PrinterTemplateDropdown from './PrinterTemplateDropdown';
import './PrintModal.css';
import { useFileDropperContext } from '../contexts/fileDropper';
import { useAppDataContext } from '../contexts/appData';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';

type PrintModalProps = {
  open: boolean;
  onClose: () => void;
};

export const PrintModal = ({ open, onClose }: PrintModalProps) => {
  const { canvasArrayRef } = useFileDropperContext();
  const { printOptions, setPrintOptions } = useAppDataContext();
  const { fileType, imageType, cutMarks } = printOptions;
  const cutMarksDisable = fileType === 'zip';
  return (
    <Modal open={open} onClose={onClose}>
      <div className="printModal">
        <Paper className="verticalStack modalContent">
          <IconButton className="closeIcon">
            <CloseIcon onClick={onClose} />
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
          <Typography>
            The format of the labels can be of type 'vector' or 'raster'. Vector
            will preserve the quality of your images as is and provice a vector
            template around the image. Raster will make a new PNG that contains
            both the template and your image at 300DPI, the artwork for the
            labels will be rescaled at 300DPI but the quality will not improve
            if you have low resolution images. Vector will look nicer but will
            not support the faint shadow around the image.
          </Typography>
          <div className="horizontalStack">
            <Typography flexGrow="1">Type of ouput:</Typography>
            <Button
              onClick={() => setPrintOptions({ imageType: 'vector' })}
              variant="contained"
              size="large"
              color={imageType === 'vector' ? 'primary' : 'secondary'}
            >
              <Typography>Vector</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ imageType: 'raster' })}
              variant="contained"
              size="large"
              color={imageType === 'raster' ? 'primary' : 'secondary'}
            >
              <Typography>Raster</Typography>
            </Button>
          </div>
          {/* CUTTING MARKS */}
          <Typography color={cutMarksDisable ? 'dimgrey' : undefined}>
            Add some cut helper on the print. 'crop' will provide tiny black
            lines near the labels to align a manual cutter. 'cut' will provide
            an outline for the labels for automatic cutters. This option is only
            for PDF output.
          </Typography>
          <div className="horizontalStack">
            <Typography
              color={cutMarksDisable ? 'dimgrey' : undefined}
              flexGrow="1"
            >
              Cutting marks:
            </Typography>
            <Button
              onClick={() => setPrintOptions({ cutMarks: 'crop' })}
              variant="contained"
              disabled={cutMarksDisable}
              size="large"
              color={cutMarks === 'crop' ? 'primary' : 'secondary'}
            >
              <Typography>Crop marks</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ cutMarks: 'cut' })}
              variant="contained"
              disabled={cutMarksDisable}
              size="large"
              color={cutMarks === 'cut' ? 'primary' : 'secondary'}
            >
              <Typography>Cutting shape</Typography>
            </Button>
            <Button
              onClick={() => setPrintOptions({ cutMarks: 'none' })}
              variant="contained"
              disabled={cutMarksDisable}
              size="large"
              color={cutMarks === 'none' ? 'primary' : 'secondary'}
            >
              <Typography>None</Typography>
            </Button>
          </div>
          <PdfButton canvasArrayRef={canvasArrayRef} />
          <PrinterTemplateDropdown />
          <Button variant="contained" size="large" color="primary">
            <Typography>Download</Typography>
          </Button>
        </Paper>
      </div>
    </Modal>
  );
};

export default PrintModal;
