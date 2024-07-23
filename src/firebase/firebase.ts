import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "map-markers-6f140.firebaseapp.com",
  projectId: "map-markers-6f140",
  storageBucket: "map-markers-6f140.appspot.com",
  messagingSenderId: "1037826828906",
  appId: "1:1037826828906:web:9744a7575e48f010fc7813",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
