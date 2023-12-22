import { useContext } from 'react';
import { FileDropContext } from './components/FileDropper';
import { LabelEditor } from './components/LabelEditor';
import './App.css';

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
    <div className="mainContainer">
      {files.map(file => <LabelEditor file={file} />)}
    </div>
  )
}

export default App
