import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

/**
 * Whether Firebase is configured. The committed config intentionally ships
 * without an API key, so the app must degrade gracefully: core analysis and
 * scanning still work; auth-gated features (history/applications) prompt to
 * sign in once a real config is provided.
 */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  googleProvider = new GoogleAuthProvider();
}

export { auth, db };

export const signIn = () => {
  if (!auth || !googleProvider) {
    return Promise.reject(new Error('Authentication is not configured for this deployment.'));
  }
  return signInWithPopup(auth, googleProvider);
};

export const logOut = () => (auth ? signOut(auth) : Promise.resolve());
