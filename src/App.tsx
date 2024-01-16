import { lazy, Suspense } from 'react';
import { FileDropper } from './components/FileDropper';
import { useFileDropperContext } from './contexts/fileDropper';
import { Header } from './components/Header';

import './App.css';

const LabelsView = lazy(() => import('./components/LabelsView'));

function App() {
  const { files } = useFileDropperContext();
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
        {hasFiles && (
          <Suspense fallback={null}>
            <LabelsView />
          </Suspense>
        )}
      </FileDropper>
      <div id="react-color-portal" style={{ position: 'relative' }}></div>
    </>
  );
}

export default App;
