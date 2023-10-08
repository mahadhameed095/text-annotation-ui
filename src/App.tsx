import AnnotationTool  from "./pages/AnnotationTool";
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>  
          <Route path="/login" element={<Authentication/>}></Route>  
          <Route path="/tool" element={<AnnotationTool/>}></Route>  
          <Route path="*" element={<Home/>}></Route>  
        </Routes>
    </Router>
  )
}