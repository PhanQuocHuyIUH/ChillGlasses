import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4MgMqmuGnxRNj995Z6axuHyF4IUvE9ds",
  authDomain: "chillglass-1ac91.firebaseapp.com",
  projectId: "chillglass-1ac91",
  storageBucket: "chillglass-1ac91.firebasestorage.app",
  messagingSenderId: "317446761368",
  appId: "1:317446761368:web:7f78a9eb10a89611d719ed",
  measurementId: "G-RYDLL1VY7C"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
