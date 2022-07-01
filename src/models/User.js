import { MethodsExtensions } from "../utils/MethodsExtensions";

export class User extends MethodsExtensions {
    constructor(name, email, photo) {
        super();
        this.name = name;
        this.email = email;
        this.photo = photo;
    }
}