import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { UserNav } from "./UserNav";

const Header = () => {
    const [user, setUser] = useState<typeof auth.currentUser>(null);
    const { hash, pathname, search } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setUser(user);
        });
    }, [])

    return ( 
        <>
        <header className="bg-black py-2 flex">
            <div className="p-2 my-auto mr-auto">
                <Link to="/">
                    <h1 className="text-white text-2xl px-2 sm:px-8 font-semibold">AnnoText</h1>
                </Link>
            </div>
            <div className="ml-auto flex items-center space-x-4 px-6">
                {auth.currentUser && <UserNav name="Raahim Siddiqi" email="raahim.s@hotmail.com" />}
            </div>   
        </header>   
        </>
     );
}
 
export default Header;



            {/* {pathname === "/" ?
            <div className="pr-4 md:pr-12 flex">
                <Link to="/tool">
                    <button className="btn bg-white w-48 h-12 text-xl rounded shadow p-2 hover:bg-gray-200">Annotation Tool</button>
                </Link>
            </div> : "" } */}