import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCsjU0bpQS9wMjSnkHwdfY5g1sC20JxZa0",
  authDomain: "personal-diary-app-9ae81.firebaseapp.com",
  projectId: "personal-diary-app-9ae81",
  storageBucket: "personal-diary-app-9ae81.firebasestorage.app",
  messagingSenderId: "725668428678",
  appId: "1:725668428678:web:4fac3c527b72b13003ca07"
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
