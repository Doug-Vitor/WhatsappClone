import { Model } from "./Model";
import { Firebase } from '../utils/Firebase'

export class Chat extends Model {
    constructor() {
        super();
    }

    get users() { this._data.users; }
    set users(value) { this._data.users = value; }

    get timeStamp() { this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }

    static getRef() {
        return Firebase.firestore().collection('/chats');
    }

    static create(myEmail, contactEmail) {
        return new Promise((resolve, reject) => {
            Chat.find(myEmail, contactEmail).then(chats => {
                if (chats.empty) {
                    let users = {};
                    users[btoa(myEmail)] = true;
                    users[btoa(contactEmail)] = true;

                    Chat.getRef().add({
                        users,
                        timeStamp: new Date()
                    }).then(doc => {
                        Chat.getRef().doc(doc.id).get().then(chat => {
                            resolve(chat);
                        }).catch(error => {
                            reject(error);
                        });
                    }).catch(error => {
                        reject(error);
                    })
                } else {
                    chats.forEach(chat => {
                        resolve(chat);
                    })
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    static find(myEmail, contactEmail) {
        return Chat.getRef()
            .where(btoa(myEmail), '==', true)
            .where(btoa(contactEmail), '==', true)
            .get();
    }
}