import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCmOzZZtvmXKzFiRUdj6advuRILKvtr78w",
    authDomain: "mern-estate-9682b.firebaseapp.com",
    projectId: "mern-estate-9682b",
    storageBucket: "mern-estate-9682b.appspot.com",
    messagingSenderId: "32850215280",
    appId: "1:32850215280:web:457f54836d168dbc030fb5"
};

console.log("🔥 API KEY:", import.meta.env.VITE_FIREBASE_API_KEY); // add this

export const app = initializeApp(firebaseConfig);
