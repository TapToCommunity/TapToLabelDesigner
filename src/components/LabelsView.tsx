import { LabelEditor } from './LabelEditor';
import { DataToCanvasReconciler } from './DataToCanvasReconciler';
import { useFileDropperContext } from '../contexts/fileDropper';
import './LabelsView.css';
import { SmallDropZone } from './SmallDropZone';
import { useAppDataContext } from '../contexts/appData';

export const LabelsView = () => {
  const { files, canvasArrayRef } = useFileDropperContext();
  const { template } = useAppDataContext();

  return (
    <div className="labelsView">
      {files.map((file, index) => (
        <LabelEditor
          className={`labelContainer ${template.layout}`}
          key={`key-susp-${file.name || file}`}
          index={index}
          file={file}
          canvasArrayRef={canvasArrayRef}
        />
      ))}
      <SmallDropZone className={`labelContainer ${template.layout}`} />
      <DataToCanvasReconciler />
    </div>
  );
};

export default LabelsView;
