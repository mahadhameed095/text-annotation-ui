import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { z } from 'zod';
import { useFormik } from 'formik';
import { auth, db } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { useState }  from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Schema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
});

const Authentication = () => {
    const [isRegister, setIsRegister] = useState<Boolean>(false);
    const navigate = useNavigate();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // useEffect(() => {
    //     onAuthStateChanged(auth, async (user) => {
    //         setIsAuthenticated(!!user);
    //     });
    // }, [])

    // const SignOut = (auth: Auth) => {
    //     signOut(auth);
    //     navigate("/");
    // }

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

    const SignUp = () => 
    {
          console.log("meow");
          formik.handleSubmit();
          createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password).then((response)=>{
              console.log("sign up successful");
              console.log(auth);

              const colRef = collection(db, "users");
              addDoc(colRef, {
                email: formik.values.email,
                name: formik.values.name
              }).then(() => navigate("/"))
          })
          .catch((err) => {
              console.log(err);
          })
    };
  
    const SignIn = () =>
    {
        console.log("meow");
        formik.handleSubmit();
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password).then((response)=>{
            if (response) {
                console.log("sign in successful");
                console.log(auth)
                navigate("/");
            }
        })
        .catch((err) => {
            console.log(err.code);
            if (err.code == "auth/wrong-password")
                formik.setErrors({"password": "Incorrect password"})
            else if (err.code == "auth/user-not-found")
                formik.setErrors({"email": "User not found"})
        })
    };
  
    const GoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
        navigate("/")
    };

    return ( 
        <div className="bg-gray-100 container flex h-screen">
            <div className='bg-white shadow-md rounded w-80 m-auto px-8 pt-6 pb-8'>
                <div className='mb-4'>  
                    {
                        isRegister &&
                            <>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Name
                                </label>
                                <input
                                    className='shadow w-full border rounded py-2 appearance-none'
                                    {...formik.getFieldProps('name')}
                                    id="name"
                                    name="name"
                                /> 
                            </>
                    }
                </div>
                <div className='mb-4'> 
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        className='shadow w-full border rounded py-2 appearance-none'
                        {...formik.getFieldProps('email')}
                        type="email"
                        id="email"
                        name="email"
                    /> 
                </div>
                <div className='mb-4'> 
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Password
                    </label>
                        <input
                                className='shadow w-full border rounded py-2 appearance-none'
                                {...formik.getFieldProps('password')}
                                id="password"
                                name="password"
                        /> 
                </div>
                <div className='mb-4'>  
                    {
                        isRegister &&
                            <>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                 Confirm Password
                                </label>
                                <input
                                    className='shadow w-full border rounded py-2 appearance-none'
                                    {...formik.getFieldProps('confirmPassword')}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                /> 
                            </>
                    }
                </div>
                <div className = "flex items-center justify-between mb-6">
                    <button onClick={isRegister ? SignUp : SignIn} className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        {isRegister ? "Sign Up" : "Sign In"}
                    </button>
                    {/* <a className = "inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                    </a> */}
                </div>
                <div>
                    <button onClick={() => {setIsRegister(!isRegister)}} className='text-blue-500'>{isRegister ? "Existing user?" : "Don't have an account?"}</button>                  
                </div>
            </div>
        </div>
     );
}
 
export default Authentication;
