// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2AxQ_znwv75C3347bOXDzu1cT5EWe5dw",
  authDomain: "gamesphere-fadfc.firebaseapp.com",
  databaseURL: "https://gamesphere-fadfc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gamesphere-fadfc",
  storageBucket: "gamesphere-fadfc.appspot.com",
  messagingSenderId: "237677608317",
  appId: "1:237677608317:web:95a6d7773575e816892014",
  measurementId: "G-1YX5E546X1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
