// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFasTeG4vWIVW0ohlka4alhClXUZACSmI",
  authDomain: "ease-it-bfceb.firebaseapp.com",
  databaseURL: "https://ease-it-bfceb-default-rtdb.firebaseio.com",
  projectId: "ease-it-bfceb",
  storageBucket: "ease-it-bfceb.appspot.com",
  messagingSenderId: "675362611661",
  appId: "1:675362611661:web:7ed3a5e2338abe7b922484"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const db = app.firestore();
const auth = firebase.auth();

export {db,auth};