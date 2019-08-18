'use strict';

const { db } = require('./data-base');
const { UserModel } = require('./user-model');

module.exports.SignupModel = class SignupModel extends UserModel {

    constructor(name = '', firstName = '', username = '', password1 = '', password2 = '', configuration = {}) {
        super(configuration);

        this.name = name;
        this.firstName = firstName;
        this.username = username;
        this.password1 = password1;
        this.password2 = password2;
        this.db = db;
    }

    hasName() {
        return !!this.name;
    }

    hasFirstName() {
        return !!this.firstName;
    }

    hasUsername(){
        return !!this.username;
    }

    hasPassword1() {
        return !!this.password1;
    }

    hasPassword2() {
        return !!this.password2;
    }

    arePasswordsSame() {
        return this.password1 === this.password2;
    }

    doesUsernameExist() {
        const row = db
            .prepare('SELECT username FROM user WHERE username = ?')
            .get(this.username);

        return !!row;
    }

    addUser() {
        db
            .prepare('INSERT INTO user (username, name, firstName, password, role) VALUES (?, ?, ?, ?, ?)')
            .run(this.username, this.name, this.firstName, this.cryptPassword(this.password1), UserModel.Role.USER);
    }
}