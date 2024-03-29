import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import PdfButton from './PdfButton';
import PrinterTemplateDropdown from './PrinterTemplateDropdown';
import './PrintModal.css';
import { useFileDropperContext } from '../contexts/fileDropper';

type PrintModalProps = {
  open: boolean;
  onClose: () => void;
};

export const PrintModal = ({ open, onClose }: PrintModalProps) => {
  const { canvasArrayRef } = useFileDropperContext();
  return (
    <Modal open={open} onClose={onClose}>
      <div className="printModal">
        <PdfButton canvasArrayRef={canvasArrayRef} />
        <PrinterTemplateDropdown />
      </div>
    </Modal>
  );
};

export default PrintModal;
