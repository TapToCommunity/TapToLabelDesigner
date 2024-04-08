import { lazy, Suspense } from 'react';
import { useFileDropperContext } from './contexts/fileDropper';
import { useWindowPaste } from './hooks/useWindowPaste';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';

import './App.css';

const LabelsView = lazy(() => import('./components/LabelsView'));

function App() {
  useWindowPaste();
  const { files } = useFileDropperContext();
  const hasFiles = files.length > 0;

  return (
    <>
      <Header />
      {!hasFiles && <HomePage />}
      <Suspense fallback={null}>{hasFiles && <LabelsView />}</Suspense>
    </>
  );
}

export default App;
