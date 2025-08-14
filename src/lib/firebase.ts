// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseError } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "teacherconnect-dn75g",
  "appId": "1:707784422970:web:c8eafe935520068f4fe703",
  "storageBucket": "teacherconnect-dn75g.firebasestorage.app",
  "apiKey": "AIzaSyCYvyO91hJY-gBlaLo1aZ4FlBc7GIEGEuI",
  "authDomain": "teacherconnect-dn75g.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "707784422970"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const signUpWithEmailPassword = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
}

export const signInWithEmailPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const sendPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const updateUserProfile = async (data: any) => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "users", user.uid);
    // Use setDoc with merge: true to create or update the document
    await setDoc(userRef, data, { merge: true });
  } else {
    throw new Error("No user is signed in.");
  }
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

export const setUserRole = async (userId: string, role: string) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { role }, { merge: true });
};

export const getUserRole = async (userId: string): Promise<string | null> => {
    const profile = await getUserProfile(userId);
    return profile?.role || null;
};

export const onAuthStateChange = (callback: any) => {
  return onAuthStateChanged(auth, callback);
}

export { auth, FirebaseError };