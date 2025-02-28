import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDKYjp4HFE-NRAK-ud7r9daHbe7CKKmOPM",
    authDomain: "powermax-3050e.firebaseapp.com",
    projectId: "powermax-3050e",
    storageBucket: "powermax-3050e.firebasestorage.app",
    messagingSenderId: "837847597119",
    appId: "1:837847597119:web:9558bad5b83ab7499db88a"
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }
