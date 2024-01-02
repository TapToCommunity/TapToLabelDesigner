import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { FileDropper } from './components/FileDropper';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FileDropper>
      <App />
    </FileDropper>
  </React.StrictMode>,
);
