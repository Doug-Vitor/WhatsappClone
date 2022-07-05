import { Firebase } from "../utils/Firebase";
import { MethodsExtensions } from "../utils/MethodsExtensions";

export class User extends MethodsExtensions {
    constructor() {
        super();
    }

    static getRef() {
        return Firebase.firestore().collection('/users');
    }

    static getByEmail(email) {
        return User.getRef().doc(email);
    }
}