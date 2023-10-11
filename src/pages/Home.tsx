import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import KPIcard from '../components/KPIcard';
import StatisticsBar from '../components/StatisticsBar';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';


const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
          setIsAuthenticated(Boolean(user));
          !user ? navigate("/login") : ""
        });
      }, [])


    return ( 
        <>
        {isAuthenticated ?
        <div className='mx-auto px-2 sm:px-6 lg:px-12'>
            <div className='mt-2 sm:mt-1'>
                <div className="flex mb-2">
                    <h2 className='mx-auto sm:m-0 text-3xl mb-2'>Your Statistics</h2>
                </div>
                <div className='sm:flex'>
                    <KPIcard title={"Annotated"} color={"blue"} value={1427}></KPIcard>
                    <KPIcard title={"Assigned"} color={"green"} value={123}></KPIcard>
                </div>

                <h2 className='text-center sm:text-left text-3xl mt-8 mb-4'>Analysis Overview</h2>
                <div className='sm:flex'>
                    <KPIcard title={"Islamic "} color={"green"} value={648}></KPIcard>
                    <KPIcard title={"Non-Islamic"} color={"yellow"} value={616}></KPIcard>
                    <KPIcard title={"Hate Speech"} color={"red"} value={223}></KPIcard>
                </div>

                <h2 className='text-center sm:text-left text-3xl mt-8 mb-4'>Graphs</h2>
                <div className='lg:flex'>
                    <StatisticsBar colors={["#16A34A", "#A16207"]} data={[
                        {
                            name : "islamic", 
                            value : 480
                        },
                        {
                            name : "non-islamic", 
                            value : 417
                        }
                        ]}></StatisticsBar>
                    <StatisticsBar colors={["#0082F6", "#DC2626"]} data={[
                        {
                            name : "non-hate", 
                            value : 310
                        },
                        {
                            name : "hate", 
                            value : 96
                        }
                        ]}></StatisticsBar>
                </div>
            </div>
        </div> : ""}
        </>
     );
}
 
export default Home;