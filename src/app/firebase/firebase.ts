import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDdzYBMI_oibfZCFoLVNJu-TrGqJXbHETg",
  authDomain: "manage-locataires-db.firebaseapp.com",
  projectId: "manage-locataires-db",
  storageBucket: "manage-locataires-db.firebasestorage.app",
  messagingSenderId: "709659919674",
  appId: "1:709659919674:web:55b66959a7c4b870a1bc03",
  measurementId: "G-EVWHEVKL3F"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// pour la securistaion de l'acces a la bd firestore
export const auth = getAuth(app);
// pour le stockage de la bd firestore
export const storage = getStorage(app);