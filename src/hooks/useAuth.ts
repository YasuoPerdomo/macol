import { useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  coupleId: string | null;
  pairCode: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Load user profile from Firestore
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Generate a random pair code
  const generatePairCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'MACOL-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Register a new user
  const register = useCallback(async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      const pairCode = generatePairCode();

      const profile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name,
        coupleId: null,
        pairCode,
      };

      await setDoc(doc(db, 'users', cred.user.uid), profile);
      setUserProfile(profile);
      return profile;
    } catch (err: any) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Este email ya está registrado'
        : err.code === 'auth/weak-password'
        ? 'La contraseña debe tener al menos 6 caracteres'
        : err.code === 'auth/invalid-email'
        ? 'Email no válido'
        : 'Error al registrarse: ' + err.message;
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profileDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (profileDoc.exists()) {
        setUserProfile(profileDoc.data() as UserProfile);
      }
    } catch (err: any) {
      const msg = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
        ? 'Email o contraseña incorrectos'
        : 'Error al iniciar sesión: ' + err.message;
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }, []);

  // Pair with another user using their code
  const pairWithCode = useCallback(async (code: string) => {
    setError(null);
    if (!user || !userProfile) return;

    try {
      // Find user with this pair code
      const { getDocs, collection, query, where } = await import('firebase/firestore');
      const usersQuery = query(collection(db, 'users'), where('pairCode', '==', code.toUpperCase()));
      const snapshot = await getDocs(usersQuery);

      if (snapshot.empty) {
        setError('Código no encontrado. Verifica e intenta de nuevo.');
        return;
      }

      const partnerDoc = snapshot.docs[0];
      const partnerProfile = partnerDoc.data() as UserProfile;

      if (partnerProfile.uid === user.uid) {
        setError('No puedes emparejarte contigo mismo');
        return;
      }

      if (partnerProfile.coupleId) {
        setError('Este usuario ya está emparejado');
        return;
      }

      // Create a couple document
      const coupleId = `couple_${Date.now()}`;

      await setDoc(doc(db, 'couples', coupleId), {
        users: [user.uid, partnerProfile.uid],
        userNames: {
          [user.uid]: userProfile.displayName,
          [partnerProfile.uid]: partnerProfile.displayName,
        },
        createdAt: new Date().toISOString(),
      });

      // Update both users with the coupleId
      await setDoc(doc(db, 'users', user.uid), { ...userProfile, coupleId }, { merge: true });
      await setDoc(doc(db, 'users', partnerProfile.uid), { ...partnerProfile, coupleId }, { merge: true });

      setUserProfile({ ...userProfile, coupleId });
    } catch (err: any) {
      setError('Error al emparejar: ' + err.message);
    }
  }, [user, userProfile]);

  // Refresh profile (useful after pairing from other device)
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    if (profileDoc.exists()) {
      setUserProfile(profileDoc.data() as UserProfile);
    }
  }, [user]);

  return {
    user,
    userProfile,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    pairWithCode,
    refreshProfile,
  };
}
