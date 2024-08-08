import Modal from '@mui/material/Modal';
import './SingleCardEditModal.css';
import Button from '@mui/material/Button';
import { useFileDropperContext } from '../contexts/fileDropper';
import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

type SingleCardEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentCardIndex: number;
};

export const SingleCardEditModal = ({
  isOpen,
  onClose,
  currentCardIndex,
}: SingleCardEditModalProps) => {
  const { cards } = useFileDropperContext();
  const editableCanvas = useRef<Canvas>();
  const canvasElement = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // mount, we duplicate a card
    if (currentCardIndex > -1 && canvasElement.current) {
      const canvas = new Canvas(canvasElement.current);
      // this is not great but we do not care for now
      editableCanvas.current = canvas;
      const selectedCard = cards.current[currentCardIndex];
      if (selectedCard.canvas) {
        const jsonData = selectedCard.canvas.toJSON();
        canvas.loadFromJSON(jsonData).then(() => {
          console.log('finished cloning template');
          canvas.requestRenderAll();
        });
      }
      return () => {
        canvas && canvas.dispose();
      };
    }
  }, [cards, currentCardIndex]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="cardEditModal verticalStack">
        <div className="verticalStack editSpace">
          <canvas key="doNotChangePlease" ref={canvasElement} />
        </div>
        <div className="horizontalStack">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Confirm</Button>
        </div>
      </div>
    </Modal>
  );
};
