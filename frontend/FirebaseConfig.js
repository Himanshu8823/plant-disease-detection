// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyA4O9-j76BbPfm80cPIMy26HvDTSNjTpvs",
  authDomain: "smartirrigationsystem-e68ae.firebaseapp.com",
  projectId: "smartirrigationsystem-e68ae",
  storageBucket: "smartirrigationsystem-e68ae.appspot.com",
  messagingSenderId: "129204106480",
  appId: "1:129204106480:web:bc7ef0a726954f82df7e35",
  measurementId: "G-47FDDYJ495"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
