import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

export const DRIVE_READONLY_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

const firebaseConfig = {
  projectId: "gen-lang-client-0343486027",
  appId: "1:698549100123:web:41dff1fc890fa44135a97e",
  apiKey: "AIzaSyDUqPRjNGHn6qthKVA2Xjy5xYluWDyUCO8",
  authDomain: "gen-lang-client-0343486027.firebaseapp.com",
  storageBucket: "gen-lang-client-0343486027.firebasestorage.app",
  messagingSenderId: "698549100123",
  oAuthClientId: "698549100123-sbral440kkb67gsn430p4regeuhil1s9.apps.googleusercontent.com",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope(DRIVE_READONLY_SCOPE);

// Token cached purely in-memory as required by workspace guidelines
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to acquire Google Drive access token.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Google sign in failed:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
