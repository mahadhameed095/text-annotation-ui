import Admin from "./pages/Admin";
import AnnotationTool  from "./pages/AnnotationTool";
import Authentication from "./pages/Authentication";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import Header from "./components/Header";
import { userContext, userType } from "./context";
import { useState } from "react";
export default function App() {
  const [user, setUser] = useState<userType | null>(null);

  const login = (user: userType) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null); // Clear user data, effectively logging the user out
  };

  return (
    <userContext.Provider value={{user, login, logout}}>
      <Router basename='/text-annotation-ui/'>
          <Toaster/>
          <Header />
          <div className="container min-h-[calc(100vh - 64px)]">
            <Routes>
              <Route path="/" element={<Home/>} /> 
              <Route path="/login" element={<Authentication/>} /> 
              <Route path="/tool" element={<AnnotationTool/>} /> 
              <Route path="/admin" element={<Admin/>} />
              <Route path="*" element={<Home/>} />  
            </Routes>
          </div>
      </Router>
    </userContext.Provider>
  )
}