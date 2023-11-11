import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState }  from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userContext, userContextType } from '@/context';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase-config';
import { User } from "../../api";


const Authentication = () => {
    const {user, login} = useContext(userContext) as userContextType;
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        user ? navigate("/") : ""
    }, [])

    useEffect(() => {
        onAuthStateChanged(auth, async () => {
            auth.currentUser!.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                FetchUserDetails(idToken);
              }).catch(function(error) {
                console.log(error)
              });
        });
    }, [])
  
    const FetchUserDetails = (accessToken: string) => {
        User.signIn({
            body: {
                token: accessToken
            }
        }).then(({status, body}) => {
            if (status == 200) {
                console.log(body);
                login({
                    id: body.id,
                    name: body.name ? body.name : "",
                    email: body.email ? body.email : "",
                    role: body.role,
                    token: accessToken,
                    approved: body.approved
                });
                navigate("/");
            }
            else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                })
            }
        }).catch((err: any) => {
            toast({
                variant: "destructive",
                title: "Unable to establish connection",
                description: err.message + ' ~ Contact Administrator at k200338@nu.edu.pk',
            })
        })
    }


    const SignIn = () =>
    {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((result: any) => {
            const accessToken = result.user.accessToken
            FetchUserDetails(accessToken);
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
