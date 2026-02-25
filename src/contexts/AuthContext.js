import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, type) {
    console.log('Attempting signup for:', email);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase Auth user created:', result.user.uid);
      const user = result.user;

      // Set display name
      console.log('Updating profile...');
      await updateProfile(user, {
        displayName: email.split('@')[0]
      });

      // Store user type in Firestore
      console.log('Saving to Firestore users collection...');
      await setDoc(doc(db, 'users', user.uid), {
        email,
        type,
        createdAt: new Date().toISOString()
      });
      console.log('Firestore user doc created');

      setUserType(type);
      return result;
    } catch (err) {
      console.error('Signup error details:', err);
      throw err;
    }
  }

  async function login(email, password, type) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Fetch user type from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserType(data.type);
    } else {
      // Fallback or set type if missing
      setUserType(type);
    }

    return result;
  }

  function logout() {
    setUserType(null);
    return signOut(auth);
  }

  function updateUserType(type) {
    setUserType(type);
    if (currentUser) {
      setDoc(doc(db, 'users', currentUser.uid), { type }, { merge: true });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user type on auth state change
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserType(userDoc.data().type);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userType,
    signup,
    login,
    logout,
    updateUserType
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
