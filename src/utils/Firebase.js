const firebase = require('firebase');
require ('firebase/firestore')

export class Firebase {
    constructor() {
        if (!window.isInitialized) {
            firebase.initializeApp({
                apiKey: "AIzaSyDFW-t-lDTZ3RlGhSvLL_77-DR4Kc44yAE",
                authDomain: "wpclone-bf4f5.firebaseapp.com",
                databaseURL: "https://wpclone-bf4f5-default-rtdb.firebaseio.com",
                projectId: "wpclone-bf4f5",
                storageBucket: "wpclone-bf4f5.appspot.com",
                messagingSenderId: "320545059039",
                appId: "1:320545059039:web:21ef1631395ef7c437b96a"
            })

            firebase.firestore().settings({
                timestampsInSnapshots: true
            })

            window.isInitialized = true;
        }
    }

    initAuth() {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(result => {
                resolve(result.user);
            })
            .catch(error => {
                reject(error);
            })
        });
    }

    //db
    firestore() {
        return firebase.firestore();
    }

    //hd
    storage() {
        return firebase.storage();
    }
}