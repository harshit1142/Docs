
import TextEditor from "./components/TextEditor";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {v4 as uuidV4} from 'uuid'


function App() {



  return (
 
   <BrowserRouter>
       <Routes >
       
        <Route path="/" element={<Navigate replace to={`/document/${uuidV4()}`} />} />
      
        <Route path="/document/:id" element={<TextEditor />} />
       
        </Routes>
   </BrowserRouter>
 
  );
}

export default App;
