import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
//import { getFirestore } from 'firebase/firestore/lite'
import { getFirestore, collection, addDoc } from "firebase/firestore";

export class Firebase {
    constructor() {
        this.app = initializeApp({
            apiKey: "AIzaSyDFW-t-lDTZ3RlGhSvLL_77-DR4Kc44yAE",
            authDomain: "wpclone-bf4f5.firebaseapp.com",
            databaseURL: "https://wpclone-bf4f5-default-rtdb.firebaseio.com",
            projectId: "wpclone-bf4f5",
            storageBucket: "wpclone-bf4f5.appspot.com",
            messagingSenderId: "320545059039",
            appId: "1:320545059039:web:21ef1631395ef7c437b96a"          
        });
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

    saveUser(user) {
        return addDoc(collection(getFirestore(this.app), 'users'), {
            name: user['name'],
            email: user['email'],
            photo: user['photo']
        });
    }
}