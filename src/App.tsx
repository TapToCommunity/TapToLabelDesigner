import { lazy, Suspense } from 'react';
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
        <Suspense fallback={null}>
          <LabelsView />
        </Suspense>
      )}
    </>
  );
}

export default App;
