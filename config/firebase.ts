
import { initializeApp } from "firebase/app";
import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: "expo-demo-ec1a6.appspot.com",
  // storageBucket:Constants.expoConfig?.extra?.firebaseStorageBucket
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getDatabase(app)
const storage = getStorage(app);

export { app, auth, db, storage };