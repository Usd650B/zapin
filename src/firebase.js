import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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

// Note: Removed persistence settings to avoid multi-tab conflicts
export default app;
