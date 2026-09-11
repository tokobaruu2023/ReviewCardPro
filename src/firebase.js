import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdXAL0dtkfaN_nZcx3sZKvSeASBZtTJ0M",
  authDomain: "mari-review-system.firebaseapp.com",
  projectId: "mari-review-system",
  storageBucket: "mari-review-system.firebasestorage.app",
  messagingSenderId: "1093456118447",
  appId: "1:1093456118447:web:f2b90f6cd64440bfbe8a5a"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
