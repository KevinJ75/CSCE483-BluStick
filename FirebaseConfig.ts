// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import React from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCESAtH75cAAONkJmu0j0RoUcnAuHQZ5eI",
//   authDomain: "blustickfirebase483.firebaseapp.com",
//   storageBucket: "blustickfirebase483.firebasestorage.app",
//   messagingSenderId: "577830299435",
//   appId: "1:577830299435:web:917cac6c2971547220076e"
// };

const firebaseConfig = {
  apiKey: "AIzaSyB9O7xsyqOw3KuhHFNXAdISCoUX6PlBDy8",
  authDomain: "test1-91449.firebaseapp.com",
  projectId: "test1-91449",
  storageBucket: "test1-91449.firebasestorage.app",
  // messagingSenderId: "577830299435",
  // appId: "1:577830299435:web:917cac6c2971547220076e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);