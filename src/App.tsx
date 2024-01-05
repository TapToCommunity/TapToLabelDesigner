import { lazy, Suspense } from 'react';
import { FileDropper } from './components/FileDropper';
import { useFileDropperContext } from './contexts/fileDropper';
import { Header } from './components/Header';

import './App.css';

const LabelEditor = lazy(() => import('./components/LabelEditor'));
const DataToCanvasReconciler = lazy(
  () => import('./components/DataToCanvasReconciler'),
);
function App() {
  const { files, canvasArrayRef } = useFileDropperContext();
  const hasFiles = files.length > 0;

  return (
    <>
      <Header />
      <FileDropper>
        {!hasFiles && (
          <div className="somePadding">
            <h1>
              Start by dropping in the browser one or more images you want to
              use on your labels
            </h1>
            <h4>Or click the button to load your files</h4>
          </div>
        )}
        {files.map((file, index) => (
          <Suspense key={`key-susp-${index}`} fallback={null}>
            <LabelEditor
              index={index}
              key={`key-${index}`}
              file={file}
              canvasArrayRef={canvasArrayRef}
            />
          </Suspense>
        ))}
        {hasFiles && (
          <Suspense>
            <DataToCanvasReconciler />
          </Suspense>
        )}
      </FileDropper>
    </>
  );
}

export default App;
