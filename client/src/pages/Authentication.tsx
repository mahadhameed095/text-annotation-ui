import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState }  from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { userContext, userContextType } from '@/context';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import { GoogleAuthProvider, IdTokenResult, OAuthCredential, ParsedToken, UserCredential, getIdToken, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase-config';
import { User } from 'api';


const Authentication = () => {
    const {user, login} = useContext(userContext) as userContextType;
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        user ? navigate("/") : ""
    }, [])

    // useEffect(() => {
    //     onAuthStateChanged(auth, async (user) => {
    //         auth.currentUser!.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    //             // Send token to your backend via HTTPS
    //             // ...
    //             console.log(idToken)
    //           }).catch(function(error) {
    //             // Handle error

    //           });
    //     });
    // }, [])
  
    const SignIn = () =>
    {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((cred: UserCredential) => {
            User.signup({
                body: {
                    token: string
                }
            }).then(({status, body}) => {
                if (status == 200) {
                    login(body);
                    navigate("/");
                }
                else {
                    toast({
                        variant: "destructive",
                        title: "Login Failed",
                        description: body.message,
                    })
                }
            }).catch((err: any) => {
                toast({
                    variant: "destructive",
                    title: "Unable to establish connection",
                    description: err.message + ' ~ Contact Administrator at k200338@nu.edu.pk',
                })
            })
        })
        .catch((error: any) => {
            console.log(error)
        })
        setIsLoading(false);
    };
  

    return ( 
        <div className="flex h-[calc(100vh-64px)]">
            {isLoading == false ? 
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
            : Spinner({className:"w-16 m-auto"})}
        </div>
     );
}
 
export default Authentication;
