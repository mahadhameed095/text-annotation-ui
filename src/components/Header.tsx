import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { Auth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

const Header = () => {
    const [user, setUser] = useState<typeof auth.currentUser>(null);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setUser(user);
        });
    }, [])

    const SignOut = (auth: Auth) => {
        signOut(auth);
        navigate("/login");
    } 

    onAuthStateChanged(auth, (user) => {
        console.log(user);
        setUser(user);
    });

    return ( 
        <header className="bg-blue-500 py-4 flex">
            <div className="container my-auto mx-auto">
                <h1 className="text-white text-2xl px-2 sm:px-8 font-semibold">AnnoText</h1>
                <h2 className="text-white text-sm px-2 sm:px-8 font-style: italic">Hello {auth.currentUser?.email}!</h2>
            </div>
            <div className="pr-4 md:pr-12 flex">
                <Link to="/tool">
                    <button className="btn bg-white rounded shadow w-44 h-12 hover:bg-gray-200">To Annotation Tool</button>
                </Link>
                <button onClick={() => SignOut(auth)}>
                    <svg className="h-8 w-8 text-white m-2 ml-8"  width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
                </button>
                
            </div>
        </header>
     );
}
 
export default Header;
