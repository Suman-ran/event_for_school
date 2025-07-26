import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKk8f1wkZCG8FogQMRSkthU7aEDok0DX0",
  authDomain: "eventdata-4a298.firebaseapp.com",
  projectId: "eventdata-4a298",
  storageBucket: "eventdata-4a298.firebasestorage.app",
  messagingSenderId: "94487282010",
  appId: "1:94487282010:web:477b71247b66a38ba5b363",
  measurementId: "G-32LNZZS3GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;