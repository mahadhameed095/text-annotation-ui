import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import { User } from '../api.ts';

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
};

const defaultUserContext : userContextType = {
  user: null,
  setUser: () => {}
}

const UserContext = createContext(defaultUserContext);

export const UserProvider : React.FC<PropsWithChildren<unknown>> = ({ children } : any) => {
  const [user, setUser] = useState<userType | null>(null);

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
              }
            })
            }).catch((error) => {
              console.log(error)
          });
      }
      else {
        setUser(null);
      }
    });

  }, []);


  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};