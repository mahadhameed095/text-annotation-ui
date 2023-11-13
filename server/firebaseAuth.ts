import admin from 'firebase-admin';
import serviceAccount from './service_account_keys.json';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
  
export const auth = admin.auth();