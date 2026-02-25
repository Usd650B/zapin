import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAgFCSMENNOROoT8j4NfZxCruuDf2zkZow",
  authDomain: "studio-5454762906-4abc1.firebaseapp.com",
  projectId: "studio-5454762906-4abc1",
  storageBucket: "studio-5454762906-4abc1.firebasestorage.app",
  messagingSenderId: "640442010957",
  appId: "1:640442010957:web:5c9d160df6c82dd4167b04"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable Firestore persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn('Firestore persistence failed: Browser not supported');
  }
});

// Set Auth persistence to local
setPersistence(auth, browserLocalPersistence);

export default app;
