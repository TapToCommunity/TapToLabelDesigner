import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AppDataContextProvider } from './components/AppDataProvider.tsx';
import { FileDropperContextProvider } from './components/FileDropperProvider';
import './index.css';
import createTheme from '@mui/material/styles/createTheme';
import { ThemeProvider } from '@emotion/react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5361D9',
      contrastText: '#FFFFFF',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppDataContextProvider>
        <FileDropperContextProvider>
          <App />
        </FileDropperContextProvider>
      </AppDataContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
