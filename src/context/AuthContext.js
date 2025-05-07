'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged,
  signInWithPopup, 
  signInWithPhoneNumber,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth, googleProvider, phoneProvider } from '../lib/firebase';

// Create authentication context
const AuthContext = createContext({});

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Phone sign in (requires recaptcha setup)
  const signInWithPhone = async (phoneNumber, appVerifier) => {
    try {
      setError(null);
      return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signInWithGoogle,
      signInWithPhone,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);