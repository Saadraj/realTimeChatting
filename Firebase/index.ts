import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const firebaseConfig = {
    apiKey: publicRuntimeConfig.FIREBASE_apiKey,
    authDomain: publicRuntimeConfig.FIREBASE_authDomain,
    projectId: publicRuntimeConfig.FIREBASE_projectId,
    storageBucket: publicRuntimeConfig.FIREBASE_storageBucket,
    messagingSenderId: publicRuntimeConfig.FIREBASE_messagingSenderId,
    appId: publicRuntimeConfig.FIREBASE_appId,
    measurementId: publicRuntimeConfig.FIREBASE_measurementId,
};
if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (error) {
        console.log("Firebase admin initialization error", error.stack);
    }
}

export const fireStore = firebase.firestore();
export const auth = firebase.auth();

export default firebase;
