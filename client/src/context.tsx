import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../api.ts';
import { useToast } from './components/ui/use-toast.ts';

export interface userType {
    id: string
    name: string;
    email: string;
    role: string;
    token: string;
    approved: boolean
  }

export interface userContextType {
    user: userType | null;
    setUser: (user: userType | null) => void;
    isFetching: boolean,
};

const defaultUserContext : userContextType = {
  user: null,
  setUser: () => {},
  isFetching: false
}

const UserContext = createContext(defaultUserContext);

export const UserProvider : React.FC<PropsWithChildren<unknown>> = ({ children } : any) => {
  const [user, setUser] = useState<userType | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const {toast} = useToast();

  useEffect(() => { 
    onAuthStateChanged(auth, () => {  
      if (auth.currentUser) {
          auth.currentUser.getIdToken(true).then((idToken) => {
            User.signIn({
              body: {
                token: idToken
              }
            }).then(({status, body}) => {
              if (status == 200) {
                const userDetails = {
                  id: body.id,
                  name: body.name ? body.name : "",
                  email: body.email ? body.email : "",
                  role: body.role,
                  token: idToken,
                  approved: body.approved
                }
                setUser(userDetails);
                setIsFetching(false);
              }
            }).catch((error) => {
              toast({
                variant: "destructive",
                title: error.message,
                description: "Contact k200338@nu.edu.pk for assistance",
              })
              setIsFetching(false);
            })
          }).catch((error) => {
            toast({
              variant: "destructive",
              title: error.message,
              description: "Contact k200338@nu.edu.pk for assistance",
            })
            setIsFetching(false);
          });
      }
      else {
        setUser(null);
        setIsFetching(false);
      }
    });

  }, []);


  return (
    <UserContext.Provider value={{ user, setUser, isFetching}}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};