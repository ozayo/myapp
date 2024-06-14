// firebase-config.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBkTjDm1BNg32Mrm3g721c9-Gz8sj6KHOY",
  authDomain: "myapp-609f2.firebaseapp.com",
  projectId: "myapp-609f2",
  storageBucket: "myapp-609f2.appspot.com",
  messagingSenderId: "542319139206",
  appId: "1:542319139206:web:4eeeb4028a25d8ccaa3407"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
