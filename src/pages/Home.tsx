import Header from '../components/Header';
import { useRef } from 'react';
import Papa from 'papaparse';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase-config';
import KPIcard from '../components/KPIcard';
import StatisticsBar from '../components/StatisticsBar';

const Home = () => {
    const inputFile = useRef(null);

    const uploadDocuments = (e: Event) => {
        console.log(inputFile)
        if (inputFile.current !== null) {
            Papa.parse(inputFile.current.files[0], {
                complete: (results) => {
                  if (results.data.length > 0) {
                    // Iterate through each row in the CSV file
                    results.data.forEach((row: any, index: any) => {
                        setDoc(doc(db, "documents", `${index + 1}`), {document:row["document"]});
                    });
                  } 
                  else {
                    console.log('CSV file is empty');
                  }
                },
                header: true, // Set this to true if your CSV file has a header row
            });
        }
        e.target ? e.target.value = '' : null;
    }

    return ( 
        <>
        <Header></Header>
        <div className='mx-auto p-2 sm:p-6 lg:p-12'>
            <div className='mt-2'>
                <div className="flex mb-2">
                    <h2 className='mx-auto sm:m-0 text-3xl mb-2'>Your Statistics</h2>
                    <button className='hidden sm:block bg-blue-500 rounded p-2 text-white ml-auto' onClick={()=>{inputFile.current.click()}}>
                        Upload Documents<br></br> (admin only)<input type='file' id='file' onChange={uploadDocuments}  ref={inputFile} style={{display: 'none'}}/>
                    </button>
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
                    <StatisticsBar colors={["#16A34A", "#DC2626"]} data={[
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
        </div>
        </>
     );
}
 
export default Home;