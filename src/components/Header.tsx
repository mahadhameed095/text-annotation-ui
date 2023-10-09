import { Link } from "react-router-dom";
import { auth } from "../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

const Header = () => {
    const [user, setUser] = useState<typeof auth.currentUser>(null);
    
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
            <div className="pr-4 md:pr-12">
                <Link to="/tool">
                    <button className="btn bg-white rounded shadow w-44 h-12 hover:bg-gray-200">To Annotation Tool</button>
                </Link>
            </div>
        </header>
     );
}
 
export default Header;
