import Admin from "../pages/Admin"
import AnnotationTool  from "../pages/AnnotationTool";
import Authentication from "../pages/Authentication";
import Home from "../pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from "./Header";
import { Toaster } from "./ui/toaster";
import { useAuth } from "@/context";


const Main = () => {
    const {user} = useAuth();
    
    return ( 
        <Router>
            <Toaster/>
            <Header />
            <div className="max-w-screen-2xl mx-auto min-h-[calc(100vh - 64px)]">
            <Routes>
                <Route path="/" element={user ? <Home/> : <Navigate to="/login"/>} /> 
                <Route path="/login" element={user ? <Navigate to="/home"/> : <Authentication/>} /> 
                <Route path="/tool" element={user ? <AnnotationTool/> : <Navigate to="/login"/>} /> 
                <Route path="/admin" element={user ? <Admin/> : <Navigate to="/login"/>} />
                <Route path="*" element={user ? <Home/> : <Navigate to="/login"/>} />  
            </Routes>
            </div>
        </Router>
     );
}
 
export default Main;