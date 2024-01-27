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
          key={`key-susp-${
            (file as File).name || (file as HTMLImageElement).src
          }`}
          index={index}
          file={file}
          canvasArrayRef={canvasArrayRef}
        />
      ))}
      {files.length % 2 && (
        <div className={`labelContainer ${template.layout}`} />
      )}
      <SmallDropZone className={`labelContainer ${template.layout} dropzone`} />
      <DataToCanvasReconciler />
    </div>
  );
};

export default LabelsView;
