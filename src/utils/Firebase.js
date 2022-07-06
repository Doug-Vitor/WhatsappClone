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
    static firestore() {
        return firebase.firestore();
    }

    //hd
    static storage() {
        return firebase.storage();
    }

    static uploadFile(file, from) {
        return new Promise((resolve, reject) => {
            let uploadTask = Firebase.storage().ref(from).child(`${Date.now()}_${file.name}`).put(file);
            
            uploadTask.on('state_changed', () => {}, error => {
                reject(error);
            }, () => {
                uploadTask.snapshot.ref.getDownloadURL().then(url => {
                    resolve(url);
                }).catch(error => {
                    reject(error);
                })
            });
        })
    }
}