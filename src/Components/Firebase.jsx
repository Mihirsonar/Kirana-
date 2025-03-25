import React from 'react'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4jyzIVOoNhU5mN_97RVeNi5kLySm0fGM",
  authDomain: "e-cart-34c93.firebaseapp.com",
  projectId: "e-cart-34c93",
  storageBucket: "e-cart-34c93.firebasestorage.app",
  messagingSenderId: "199683895369",
  appId: "1:199683895369:web:a9506b3a2903cd157ccf98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export default app;