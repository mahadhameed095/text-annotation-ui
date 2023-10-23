import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserNav } from "./UserNav";
import { userContext, userContextType } from '@/context';

const Header = () => {
    const {user} = useContext(userContext) as userContextType;

    return ( 
        <>
        <header className="bg-black py-2 flex">
            <div className="p-2 my-auto mr-auto">
                <Link to="/">
                    <h1 className="text-white text-2xl px-2 sm:px-8 font-semibold">AnnoText</h1>
                </Link>
            </div>
            <div className="ml-auto flex items-center space-x-4 px-6">
                {user && <UserNav name="Raahim Siddiqi" email="raahim.s@hotmail.com" />}
            </div>   
        </header>   
        </>
     );
}
 
export default Header;

