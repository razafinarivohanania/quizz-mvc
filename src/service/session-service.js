'use strict';

const { Language } = require('./translator');
const { LoginModel } = require('../model/login-model');

'use strict';

const express = require('express');
const session = require('express-session');

module.exports.SessionService = class SessionService {

    constructor(app = express(), configuration = {}) {
        this.defaultLanguage = Language.EN;
        this.configuration = configuration;

        app.use(session({
            secret: configuration.session.secret,
            resave: false,
            saveUninitialized: true
        }));
    }

    getLanguage(req) {
        if (!req.session.language)
            this.setLanguage(req, this.defaultLanguage);

        return req.session.language;
    }

    setLanguage(req, language) {
        if (!this.isValidLanguage(language))
            throw new Error(`Unrecognized language [${language}]`);

        req.session.language = language;
    }

    isValidLanguage(language) {
        return language === Language.EN ||
            language === Language.FR;
    }

    isLogged(req) {
        if (!req.session.user)
            return false;

        const loginModel = new LoginModel(req.session.user.username, req.session.user.password, this.configuration);
        if (loginModel.isLogged(false))
            return true;

        delete req.session.user;
        return false;
    }

    setUser(req, user) {
        req.session.user = user;
    }

    getUser(req){
        return req.session.user;
    }
}