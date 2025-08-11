// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseError } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "teacherconnect-dn75g",
  appId: "1:707784422970:web:c8eafe935520068f4fe703",
  storageBucket: "teacherconnect-dn75g.firebasestorage.app",
  apiKey: "AIzaSyCYvyO91hJY-gBlaLo1aZ4FlBc7GIEGEuI",
  authDomain: "teacherconnect-dn75g.firebaseapp.com",
  messagingSenderId: "707784422970",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export { auth, FirebaseError };
