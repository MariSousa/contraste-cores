import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDgVWPI1snr1AXBUKtWtkt6ARgCE67v2js",
  authDomain: "contrastecor.firebaseapp.com",
  databaseURL: "https://contrastecor-default-rtdb.firebaseio.com",
  projectId: "contrastecor",
  storageBucket: "contrastecor.appspot.com",
  messagingSenderId: "894598516035",
  appId: "1:894598516035:web:58e6e35a08e1bbd17d73f6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
