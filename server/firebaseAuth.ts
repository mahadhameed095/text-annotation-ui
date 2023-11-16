import admin from 'firebase-admin';
import Env from './ENV';

admin.initializeApp({
    credential : admin.credential.cert({
        projectId : Env.FIREBASE_AUTH_PROJECT_ID,
        privateKey : Env.FIREBASE_AUTH_PRIVATE_KEY,
        clientEmail : Env.FIREBASE_AUTH_CLIENT_EMAIL,
    })
});
  
export const auth = admin.auth();