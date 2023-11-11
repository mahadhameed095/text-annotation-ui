import admin from 'firebase-admin';
import serviceAccount from './annotext-4fa92-firebase-adminsdk-ks24q-96338efe3c.json';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
  
export const auth = admin.auth();