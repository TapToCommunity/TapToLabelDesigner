import Modal from '@mui/material/Modal';
import './SingleCardEditModal.css';
import Button from '@mui/material/Button';
import { useFileDropperContext } from '../contexts/fileDropper';
import { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { useRealTimeResize } from '../hooks/useRealtimeResize';

type SingleCardEditSpaceProps = {
  onClose: () => void;
  currentCardIndex: number;
};

type SingleCardEditModalProps = SingleCardEditSpaceProps & {
  isOpen: boolean;
};

export const ModalInternalComponent = ({
  onClose,
  currentCardIndex,
}: SingleCardEditSpaceProps) => {
  const { cards } = useFileDropperContext();
  const [ready, setReady] = useState(false);
  const editableCanvas = useRef<Canvas | null>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const selectedCard = cards.current[currentCardIndex];
  const padderRef = useRef<HTMLDivElement>(null);

  useRealTimeResize({
    fabricCanvas: editableCanvas.current,
    layout: selectedCard.template!.layout,
    ready,
    padderRef,
    throttleMs: 100,
  });

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
          setReady(true);
        });
      }
      return () => {
        console.log('disposing');
        canvas && canvas.dispose();
      };
    }
  }, [cards, currentCardIndex]);

  return (
    <>
      <div className="verticalStack editSpace" ref={padderRef}>
        <canvas key="doNotChangePlease" ref={canvasElement} />
      </div>
      <div className="horizontalStack">
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose}>Confirm</Button>
      </div>
    </>
  );
};

export const SingleCardEditModal = ({
  isOpen,
  onClose,
  currentCardIndex,
}: SingleCardEditModalProps) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="cardEditModal verticalStack">
        {isOpen && (
          <ModalInternalComponent
            onClose={onClose}
            currentCardIndex={currentCardIndex}
          />
        )}
      </div>
    </Modal>
  );
};
