// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';           // ADD THIS LINE
import { getFirestore } from 'firebase/firestore'; // ADD THIS LINE  
import { getStorage } from 'firebase/storage';     // ADD THIS LINE
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeb-4lWHgtA9nS6fcv1xVb86zEkW7SFyA",
  authDomain: "spelthorne-vc.firebaseapp.com",
  projectId: "spelthorne-vc",
  storageBucket: "spelthorne-vc.firebasestorage.app",
  messagingSenderId: "310893975251",
  appId: "1:310893975251:web:9e2597bf3935efcbede626",
  measurementId: "G-FR02Z4NQBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services we need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;