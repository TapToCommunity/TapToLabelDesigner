import Modal from '@mui/material/Modal';
import './SingleCardEditModal.css';
import Button from '@mui/material/Button';
import { useFileDropperContext } from '../contexts/fileDropper';
import { useEffect, useRef, useState } from 'react';
import { Canvas, type FabricObject, type Group } from 'fabric';
import { useRealTimeResize } from '../hooks/useRealtimeResize';
import { type TemplateEdit } from '../resourcesTypedef';
import { ResourceDisplay } from './ResourceDisplay';

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
  const layout = selectedCard.template?.layout;
  const padderRef = useRef<HTMLDivElement>(null);
  const [currentResource, setCurrentResource] =
    useState<[TemplateEdit, FabricObject]>();

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
      const canvas = new Canvas(canvasElement.current, {
        preserveObjectStacking: true,
      });
      // this is not great but we do not care for now
      editableCanvas.current = canvas;
      const selectedCard = cards.current[currentCardIndex];
      if (selectedCard.canvas) {
        const jsonData = selectedCard.canvas.toObject(['resourceFor']);
        canvas.loadFromJSON(jsonData).then(() => {
          if (canvas.overlayImage) {
            const overlay = canvas.overlayImage;
            canvas.overlayImage = undefined;
            overlay.controls = {};
            overlay.lockMovementX = true;
            overlay.lockMovementY = true;
            overlay.perPixelTargetFind = true;
            (overlay as Group).subTargetCheck = true;
            overlay.on('mousedown', (opt) => {
              const resource = opt.subTargets?.[0];
              if (resource && resource.resourceFor) {
                const edit = selectedCard.template?.edits?.find(
                  (edit) => edit.id === resource.resourceFor,
                );
                if (edit) {
                  setCurrentResource([edit, resource]);
                }
              }
            });
            canvas.add(overlay);
          }
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
  const classNameExt =
    layout === 'vertical' ? 'horizontalStack' : 'verticalStack';
  const classNameInt =
    layout === 'horizontal' ? 'horizontalStack' : 'verticalStack';
  return (
    <>
      <div className={`${classNameExt} editSpace`}>
        <div className={`${classNameInt} resourceSpace`}>
          <ResourceDisplay
            className={`${classNameInt}`}
            resource={currentResource?.[0]}
            target={currentResource?.[1]}
          />
        </div>
        <div className="verticalStack editSpace" ref={padderRef}>
          <canvas key="doNotChangePlease" ref={canvasElement} />
        </div>
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
