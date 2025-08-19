
// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseError } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, enableNetwork, disableNetwork } from "firebase/firestore";

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

export const updateUserProfile = async (userId: string, data: any) => {
  if (!userId) throw new Error("User ID is required to update profile.");
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, data, { merge: true });
};

export const getUserProfile = async (userId: string) => {
  if (!userId) return null;
  const userRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // If the profile doesn't exist, create a basic one.
      const basicProfile = { profileCompleted: false, role: null };
      await setDoc(userRef, basicProfile);
      return basicProfile;
    }
  } catch (error) {
     console.error("Error getting user profile:", error);
     throw error;
  }
};

export const setUserRole = async (userId: string, role: 'teacher' | 'institution') => {
  if (!userId) throw new Error("User ID is required to set role.");
  const userRef = doc(db, "users", userId);
  // Ensure a basic profile exists before setting the role
  const docSnap = await getDoc(userRef);
  if (!docSnap.exists()) {
    await setDoc(userRef, { profileCompleted: false, role: null });
  }
  await updateDoc(userRef, { role });
};


export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}

export { auth, db, FirebaseError };
