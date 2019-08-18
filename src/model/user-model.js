'use strict';

const crypto = require('crypto');

module.exports.UserModel = class UserModel {

    constructor(configuration = {}) {
        this.configuration = configuration;
    }

    cryptPassword(password = '') {
        return crypto
            .createHmac('sha256', this.configuration.database.password.salt)
            .update(password)
            .digest('hex');
    }

    static get Role(){
        return {
            USER: 0,
            ADMIN: 1
        };
    }
}