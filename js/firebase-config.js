// =========================================================
// FIREBASE CONFIG
// =========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMMGMCp_afJQpTS7fTP9fIpGn_RCHPBkc",
  authDomain: "log-a-67e94.firebaseapp.com",
  databaseURL: "https://log-a-67e94-default-rtdb.firebaseio.com",
  projectId: "log-a-67e94",
  storageBucket: "log-a-67e94.firebasestorage.app",
  messagingSenderId: "240649718791",
  appId: "1:240649718791:web:7ebb632e73ea84c0f4eea2",
  measurementId: "G-2BNE5K8HY7"
};

// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

// Firestore-da bu sənəd oxunacaq / yazılacaq:
// Collection: "invitation"   Sənəd ID: "main"
export const INVITATION_COLLECTION = "invitation";
export const INVITATION_DOC_ID = "main";
