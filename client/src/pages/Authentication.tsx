import { z } from 'zod';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState }  from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from "../../api";
import { userContext, userContextType } from '@/context';
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/firebase-config';

const Schema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
});

const Authentication = () => {
    const {user, login} = useContext(userContext) as userContextType;
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const navigate = useNavigate();
    const { toast } = useToast();


    const formik = useFormik({
        initialValues: {
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
          },
          validationSchema: toFormikValidationSchema(Schema),
          onSubmit: (values) => {
            console.log(values);
          },
      });

    useEffect(() => {
        user ? navigate("/") : ""
    }, [])
  
    const SignIn = () =>
    {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then((cred: any) => {
            console.log(cred)
        })

        User.login({
            body: {
                email: formik.values.email,
                password: formik.values.password
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
        setIsLoading(false);
    };
  

    return ( 
        <div className="flex h-[calc(100vh-64px)]">
            {isLoading == false ? 
            <Card className='bg-white shadow-md rounded w-120 m-auto'>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Login with your Google Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={SignIn} className='w-full'>
                        SignIn
                    </Button>
                </CardContent>
            </Card>
            : Spinner({className:"w-16 m-auto"})}
        </div>
     );
}
 
export default Authentication;
