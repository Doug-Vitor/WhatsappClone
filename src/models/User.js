import { Firebase } from "../utils/Firebase";
import { Model } from "./Model";

export class User extends Model {
    constructor(email) {
        super();

        if(email) this.getById(email);
    }

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    static getRef() {
        return Firebase.firestore().collection('/users');
    }

    static getByEmail(email) {
        return User.getRef().doc(email);
    }

    getById(id) {
        return new Promise((resolve, reject) => {
            User.getByEmail(id).onSnapshot(doc => {
                this.fromJSON(doc.data());
                resolve(doc);
            });
        });
    }

    save() {
        return User.getByEmail(this.email).set(this.toJSON());
    }

    addContact(contact) {
        return User.getRef().doc(this.email).collection('contact').doc(btoa(contact.email)).set(contact.toJSON());
    }
}