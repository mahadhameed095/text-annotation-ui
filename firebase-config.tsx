// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjFKevw8jO1nA_MlvVTBKXrGEaXR9e2Y8",
  authDomain: "annotext-4fa92.firebaseapp.com",
  projectId: "annotext-4fa92",
  storageBucket: "annotext-4fa92.appspot.com",
  messagingSenderId: "708127265879",
  appId: "1:708127265879:web:99492d2f0bd456205fbf12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore();