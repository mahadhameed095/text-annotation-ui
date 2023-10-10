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
        <>
        <header className="bg-blue-500 py-2 flex">
            <div className="container my-auto mx-auto">
                <h1 className="text-white text-3xl px-2 sm:px-8 font-semibold">AnnoText</h1>
            </div>
            <div className="pr-4 md:pr-12 flex">
                <Link to="/tool">
                    <button className="btn bg-white rounded shadow p-2 hover:bg-gray-200">Annotation Tool</button>
                </Link>
            </div>
        </header>
        <div className="flex mx-4 sm:mx-8">
            <h2 className="my-auto ml-auto px-2 sm:px-4 font-style: italic">Hello {auth.currentUser?.email}!</h2> 
            <button onClick={() => SignOut(auth)}>
                <svg className="ml-auto h-8 w-8 m-2 ml-8"  width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
            </button>
        </div>
        </>
     );
}
 
export default Header;
