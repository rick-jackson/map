import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "map-markers-c3347.firebaseapp.com",
  projectId: "map-markers-c3347",
  storageBucket: "map-markers-c3347.firebasestorage.app",
  messagingSenderId: "2390782251",
  appId: "1:2390782251:web:50cc847aeee42421f6556e"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
