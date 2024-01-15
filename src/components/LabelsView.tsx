import { LabelEditor } from './LabelEditor';
import { DataToCanvasReconciler } from './DataToCanvasReconciler';
import { useFileDropperContext } from '../contexts/fileDropper';
import './LabelsView.css';

export const LabelsView = () => {
  const { files, canvasArrayRef } = useFileDropperContext();

  return (
    <div className="labelsView">
      {files.map((file, index) => (
        <LabelEditor
          key={`key-susp-${file.name}`}
          index={index}
          file={file}
          canvasArrayRef={canvasArrayRef}
        />
      ))}
      <DataToCanvasReconciler />
    </div>
  );
};

export default LabelsView;
