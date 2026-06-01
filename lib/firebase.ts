import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth, type Auth } from "firebase/auth";
// getReactNativePersistence exists at runtime but is missing from the
// firebase v12 type definitions, so we read it off the module untyped.
import * as firebaseAuth from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Persist the Firebase session across app restarts using AsyncStorage.
// initializeAuth throws if auth was already created (e.g. fast refresh), so we
// fall back to getAuth in that case.
let authInstance: Auth;
try {
  const getRNPersistence = (
    firebaseAuth as unknown as {
      getReactNativePersistence: (storage: unknown) => unknown;
    }
  ).getReactNativePersistence;
  authInstance = initializeAuth(app, {
    persistence: getRNPersistence(AsyncStorage) as never,
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
