import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

/**
 * Firebase configuration
 * Replace these with actual config values from Firebase console
 */
const firebaseConfig = {
        apiKey: "AIzaSyDA6np5O_ciuQSjk2SSXpTQ4n4FAecBnGk",
        authDomain: "mommypump-f6720.firebaseapp.com",
        projectId: "mommypump-f6720",
        storageBucket: "mommypump-f6720.firebasestorage.app",
        messagingSenderId: "623313271400",
        appId: "1:623313271400:web:df9cfbf8665992167fd9dd",
        measurementId: "G-8W7BT9VQQK"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const phoneProvider = new PhoneAuthProvider(auth);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

export default app;