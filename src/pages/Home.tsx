import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Overview } from '@/components/Overview';
import { Button } from '@/components/ui/button';


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
        <div className='mx-auto p-6 md:p-10'>
            <div className='mb-4 flex'>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <div className='ml-auto'>
                    <Button className="" onClick={() => navigate("/tool")}>
                        Annotation Tool
                        <svg className='m-1' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Posts Annotated
                    </CardTitle>
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2147</div>
                    <p className="text-xs text-muted-foreground">
                      +301 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Islamic Posts Identified
                    </CardTitle>
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1321</div>
                    <p className="text-xs text-muted-foreground">
                      +101 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                       Non-Islamic Posts Identified
                    </CardTitle>
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1495</div>
                    <p className="text-xs text-muted-foreground">
                       +756 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Hate Speech Identified
                    </CardTitle>
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">429</div>
                    <p className="text-xs text-muted-foreground">
                      +106 from last month
                    </p>
                  </CardContent>
                </Card>
            </div>
            <div className="py-4 sm:grid sm:gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3 sm:mt-0 mt-2">
                  <CardHeader>
                    <CardTitle>Some Cool Shit</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
   
                  </CardContent>
                </Card>
            </div>
        </div> : ""}
        </>
     );
}
 
export default Home;