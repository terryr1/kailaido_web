import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq3CCkqGsy5zYhMKoFnRq6VWVGLiN-Ygg",
  authDomain: "kailaido-beta.firebaseapp.com",
  projectId: "kailaido-beta",
  storageBucket: "kailaido-beta.firebasestorage.app",
  messagingSenderId: "601492531155",
  appId: "1:601492531155:web:f739a2ef5edfd2faa8b126",
  measurementId: "G-QYPV9D4PMM"
};


export const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);