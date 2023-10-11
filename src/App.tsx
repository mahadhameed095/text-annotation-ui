import Admin from "./pages/Admin";
import AnnotationTool  from "./pages/AnnotationTool";
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home/>} /> 
          <Route path="/login" element={<Authentication/>} /> 
          <Route path="/tool" element={<AnnotationTool/>} /> 
          <Route path="/admin" element={<Admin/>} />
          <Route path="*" element={<Home/>} />  
        </Routes>
        <Toaster/>
    </Router>
  )
}