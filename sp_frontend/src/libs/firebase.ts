import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6P-hgisYJ3buWVNAOBLCE4zVB-GQeQb8",
  authDomain: "stockypocky.firebaseapp.com",
  projectId: "stockypocky",
  storageBucket: "stockypocky.firebasestorage.app",
  messagingSenderId: "189213547730",
  appId: "1:189213547730:web:bc6adb431b41241693e10b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);