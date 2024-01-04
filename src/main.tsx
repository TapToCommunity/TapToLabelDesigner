import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppDataContextProvider } from './components/AppDataProvider.tsx';
import { FileDropperContextProvider } from './components/FileDropperProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppDataContextProvider>
      <FileDropperContextProvider>
        <App />
      </FileDropperContextProvider>
    </AppDataContextProvider>
  </React.StrictMode>,
);
