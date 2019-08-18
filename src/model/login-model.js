'use strict';

const { db } = require('./data-base');
const { SessionService } = require('../service/session-service');
const { UserModel } = require('./user-model');

module.exports.LoginModel = class LoginModel extends UserModel {

    constructor(username = '', password = '', configuration = {}) {
        super(configuration);
        
        this.username = username;
        this.password = password;
    }

    hasUsername() {
        return !!this.username;
    }

    hasPassword() {
        return !!this.password;
    }

    isLogged(passwordToCrypt = false) {
        let password = this.password;

        if (passwordToCrypt)
            password = this.cryptPassword(password);

        this.user = db
            .prepare('SELECT * FROM user WHERE username = ? AND password = ?')
            .get(this.username, password);

        return !!this.user;
    }

    getUser() {
        return this.user;
    }
}