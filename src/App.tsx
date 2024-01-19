import { lazy, Suspense } from 'react';
import { FileDropper } from './components/FileDropper';
import { useFileDropperContext } from './contexts/fileDropper';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';

import './App.css';

const LabelsView = lazy(() => import('./components/LabelsView'));

function App() {
  const { files } = useFileDropperContext();
  const hasFiles = files.length > 0;

  return (
    <>
      <Header />
      {!hasFiles && <HomePage />}
      {hasFiles && (
        <FileDropper>
          <Suspense fallback={null}>
            <LabelsView />
          </Suspense>
        </FileDropper>
      )}
    </>
  );
}

export default App;
