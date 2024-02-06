import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/Spinner';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase-config';
import { useAuth } from '@/context';


const Authentication = () => {
    const {user, isFetching} = useAuth();
    const navigate = useNavigate();

    const SignIn = () =>
    {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(() => {
            navigate("/");
        })
        .catch((error: any) => {
            console.log(error)
        })
    };

    return ( 
        <div className="flex h-[calc(100vh-64px)]">
            {
            isFetching === false && user === null ? 
                <Card className='bg-white shadow-md rounded w-120 m-auto'>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Sign In with your Google Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={SignIn} className='w-full'>
                            Login
                        </Button>
                    </CardContent>
                </Card>
            : 
                Spinner({className:"w-16 m-auto"})
            }
        </div>
     );
}
 
export default Authentication;

