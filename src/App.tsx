import './App.css'
import { useContext } from 'react';
import { FileDropContext } from './components/FileDropper';

function App() {
  const files = useContext(FileDropContext);
  const hasFiles = files.length > 0;
  
  if (!hasFiles) {
    return (
      <>
        <h1>Start by dropping in the browser one or more images you want to use on your labels</h1>
        <h4>(Nothing works, i m building this as you read)</h4>
      </>
    );
  }
  return (
    files.map(file => file.name)
  )
}

export default App
