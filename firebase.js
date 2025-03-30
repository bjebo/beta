// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBir6lhPohM0tdOozY6BnZecEjKYMCA4TI",
  authDomain: "beta-bacfb.firebaseapp.com",
  projectId: "beta-bacfb",
  storageBucket: "beta-bacfb.firebasestorage.app",
  messagingSenderId: "197686536632",
  appId: "1:197686536632:web:82b51ba23f1a77d6f1c74d",
  measurementId: "G-GMLD7WF2VT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app); // 👈 Export database
export const storage = getStorage(app);

