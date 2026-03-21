import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcIxSyzXNNcBnxKylXAZOiKQSwi1GoIws",
  authDomain: "sjg-web.firebaseapp.com",
  projectId: "sjg-web",
  storageBucket: "sjg-web.firebasestorage.app",
  messagingSenderId: "493458428368",
  appId: "1:493458428368:web:a7646dc0ff77582d31e9d5",
  measurementId: "G-03GL2C2MKJ"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
