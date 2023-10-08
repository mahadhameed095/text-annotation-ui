import { Link } from 'react-router-dom';

const Home = () => {
    return ( 
        <>
        <header className="bg-blue-500 py-4 flex">
            <div className="container my-auto mx-auto">
                <h1 className="text-white text-2xl px-8 font-semibold">AnnoText</h1>
            </div>
            <div className="pr-4 md:pr-12">
                <Link to="/tool">
                    <button className="btn bg-white rounded shadow w-44 h-12 hover:bg-gray-200">To Annotation Tool</button>
                </Link>
            </div>
        </header>
    
        </>
     );
}
 
export default Home;