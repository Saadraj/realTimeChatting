require("dotenv").config();

module.exports = {
    future: {
        webpack5: true,
    },
    publicRuntimeConfig: {
        FIREBASE_apiKey: process.env.FIREBASE_apiKey,
        FIREBASE_authDomain: process.env.FIREBASE_authDomain,
        FIREBASE_projectId: process.env.FIREBASE_projectId,
        FIREBASE_storageBucket: process.env.FIREBASE_storageBucket,
        FIREBASE_messagingSenderId: process.env.FIREBASE_messagingSenderId,
        FIREBASE_appId: process.env.FIREBASE_appId,
        FIREBASE_measurementId: process.env.FIREBASE_measurementId,
    },
};