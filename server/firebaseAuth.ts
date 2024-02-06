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

export async function createIdToken(userId : string): Promise<string> {
    const webApiKey = ""; //get from firebase project settings
    const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${webApiKey}`;
    
    const requestBody = {
        token: await auth.createCustomToken(userId),
        returnSecureToken: true,
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        const responseData = await response.json();
        return responseData.idToken;
    } else {
        const errorData = await response.json();
        console.error('Error exchanging custom token:', errorData.error.message);
        throw new Error('Failed to exchange custom token for ID token');
    }
}
