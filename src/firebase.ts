import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBYaVB9Tcky1KorKLv9KteBQr7SgpJvXKE",
  authDomain: "macol-29314.firebaseapp.com",
  projectId: "macol-29314",
  storageBucket: "macol-29314.firebasestorage.app",
  messagingSenderId: "886499274937",
  appId: "1:886499274937:web:ef79a471da236bbc76eb68",
  measurementId: "G-08FR22W12N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
