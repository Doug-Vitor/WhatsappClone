import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export class Firebase {
    constructor() {
        this.app = initializeApp({
            apiKey: "AIzaSyDFW-t-lDTZ3RlGhSvLL_77-DR4Kc44yAE",
            authDomain: "wpclone-bf4f5.firebaseapp.com",
            projectId: "wpclone-bf4f5",
            storageBucket: "wpclone-bf4f5.appspot.com",
            messagingSenderId: "320545059039",
            appId: "1:320545059039:web:21ef1631395ef7c437b96a"
        });
    }

    static database() {
        return getFirestore(this.app);
    }

    initAuth() {
        return new Promise((resolve, reject) => {
            let auth = getAuth();

            signInWithPopup(auth, new GoogleAuthProvider()).then(result => {
                resolve(result.user);
            }).catch(error => {
                reject(error);
            })
        });
    }
}