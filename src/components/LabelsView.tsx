import { LabelEditor } from './LabelEditor';
import { DataToCanvasReconciler } from './DataToCanvasReconciler';
import { useFileDropperContext } from '../contexts/fileDropper';
import './LabelsView.css';
import { SmallDropZone } from './SmallDropZone';

export const LabelsView = () => {
  const { cards } = useFileDropperContext();
  return (
    <div className="labelsView">
      {cards.current.map((card, index) => (
        <LabelEditor
          className="labelContainer horizontal"
          key={`key-susp-${
            (card.file as File).name || (card.file as HTMLImageElement).src
          }`}
          index={index}
          card={card}
        />
      ))}
      <SmallDropZone className="labelContainer horizontal" />
      <DataToCanvasReconciler />
    </div>
  );
};

export default LabelsView;
