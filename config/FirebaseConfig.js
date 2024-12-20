// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {  getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "grocery-app-2985f.firebaseapp.com",
  projectId: "grocery-app-2985f",
  storageBucket: "grocery-app-2985f.appspot.com",
  messagingSenderId: "808346894105",
  appId: "1:808346894105:web:3697e4b1c64b3cff7acf88",
  measurementId: "G-FWL1B42M88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);