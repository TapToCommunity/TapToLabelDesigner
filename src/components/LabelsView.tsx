import { LabelEditor } from './LabelEditor';
import { DataToCanvasReconciler } from './DataToCanvasReconciler';
import { useFileDropperContext } from '../contexts/fileDropper';

export const LabelsView = () => {
  const { files, canvasArrayRef } = useFileDropperContext();

  return (
    <>
      {files.map((file, index) => (
        <LabelEditor
          key={`key-susp-${file.name}`}
          index={index}
          file={file}
          canvasArrayRef={canvasArrayRef}
        />
      ))}
      <DataToCanvasReconciler />
    </>
  );
};

export default LabelsView;
