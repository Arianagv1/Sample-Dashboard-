import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          try {
            // Synchronize authenticated user profile to Cloud Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            await setDoc(
              userRef,
              {
                uid: currentUser.uid,
                email: currentUser.email || '',
                displayName: currentUser.displayName || 'Google User',
                photoURL: currentUser.photoURL || '',
                lastLogin: new Date().toISOString(),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch (syncErr) {
            // Log sync note without blocking user access
            console.warn('Note: User profile sync to Firestore skipped or pending rules:', syncErr);
          }
        }
      },
      (authErr) => {
        console.error('Firebase Auth state change error:', authErr);
        setError(authErr.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please complete the Google Sign-In popup to access the application.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Google Sign-In popup was blocked by your browser. Please allow popups for this site and try again.');
      } else {
        setError(err.message || 'Failed to authenticate with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign-out error:', err);
      setError(err.message || 'Failed to sign out.');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOutUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
