import { useEffect, useState } from 'react';
import { FabricCanvasWrapper } from './FabricCanvasWrapper';
import { Canvas } from 'fabric';

type LabelEditorProps = {
  file: File;
}

export const LabelEditor = ({ file }: LabelEditorProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null)
  useEffect(() => {
    if (fabricCanvas) {
      console.log(fabricCanvas)
    }
  }, [fabricCanvas]);

  return <FabricCanvasWrapper setFabricCanvas={setFabricCanvas} file={file} />;
}