// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase2/app";
import {getAuth} from "firebase2/auth";
import { getFirestore } from "firebase2/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCw-tJgFgGuTwDcnDe8oPHgLK8CIMKLxJA",
  authDomain: "serverless-fall-2022-b00909479.firebaseapp.com",
  projectId: "serverless-fall-2022-b00909479",
  storageBucket: "serverless-fall-2022-b00909479.appspot.com",
  messagingSenderId: "998757267618",
  appId: "1:998757267618:web:853632571daf77237fbffb",
  measurementId: "G-WC8S9WK5WH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default { db, auth }