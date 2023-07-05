import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBTXt4vd3CMbItUR8POYkpJtdP38obU7yg",
    authDomain: "react-netflix-clone-496b4.firebaseapp.com",
    projectId: "react-netflix-clone-496b4",
    storageBucket: "react-netflix-clone-496b4.appspot.com",
    messagingSenderId: "151082363812",
    appId: "1:151082363812:web:92ff63827daec261fb2f31",
    measurementId: "G-6W2BZSC4SR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const meetingRef = collection(firebaseDB, "meetings");