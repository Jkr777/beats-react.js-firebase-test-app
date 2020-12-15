import firebase from "firebase/app";
import  'firebase/firestore';
import  'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAo51DA2kF3113q9mtLaLkoUMHKXgobYZ8",
  authDomain: "beats-bb-bb.firebaseapp.com",
  projectId: "beats-bb-bb",
  storageBucket: "beats-bb-bb.appspot.com",
  messagingSenderId: "952851552851",
  appId: "1:952851552851:web:a1d318e1b9d316531a84a6",
  measurementId: "G-XD5201CPWF"
};

const fBaseApp = firebase.initializeApp(firebaseConfig);

//db
export const DB = fBaseApp.firestore();
export const { Timestamp } = firebase.firestore;
export const usersCollection = DB.collection('users');