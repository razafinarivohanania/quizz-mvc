'use strict';

const express = require('express');
const path = require('path');
const { translate } = require('../service/translator');
const { SessionService } = require('../service/session-service');
const { LoginModel } = require('../model/login-model');
const { FullView } = require('../view/full-view');

module.exports.QuizzController = class QuizzController {

    constructor(app = express(), sessionService = new SessionService(), configuration = {}) {
        this.app = app;
        this.sessionService = sessionService;
        this.configuration = configuration;
    }

    async buildBodyLoginParameters(req, notification) {
        const language = this.sessionService.getLanguage(req);

        if (notification)
            notification = await translate(notification, language);

        const username = await translate('Username', language);
        const password = await translate('Password', language);
        const noAccount = await translate('I have no account', language);
        const login = await translate('Login', language);

        return {
            notification: notification,
            username: username,
            password: password,
            noAccount: noAccount,
            login: login
        }
    }

    async loadQuizzPage(req, res, notification = '') {
        const bodyLoginFilePath = path.resolve(__dirname, '..', 'view', 'ejs', 'login.ejs');
        const bodyLoginParameters = await this.buildBodyLoginParameters(req, notification);

        const fullView = new FullView(req, res, this.sessionService, this.configuration);

        await fullView.addDefaultHead();
        await fullView.addBody(bodyLoginFilePath, bodyLoginParameters);
        await fullView.addDefaultFoot();

        fullView.render();
    }

    async attemptToLogin(req, res) {
        const loginModel = new LoginModel(req.body.username, req.body.password, this.configuration);

        if (!loginModel.hasUsername()) {
            await this.loadQuizzPage(req, res, 'Username is empty');
            return;
        }

        if (!loginModel.hasPassword()) {
            await this.loadQuizzPage(req, res, 'Password is empty');
            return;
        }

        if (!loginModel.isLogged(true)) {
            await this.loadQuizzPage(req, res, 'Username and/or password is incorrect');
            return;
        }

        this.sessionService.setUser(req, loginModel.getUser());
        res.redirect('/');
    }

    listenEvent() {
        this.listenGetEvent();
        this.listenPostEvent();
    }

    listenGetEvent() {
        this.app.get('/quizz', async (req, res) => {
            if (this.sessionService.isLogged(req))
                await this.loadQuizzPage(req, res)
            else
                res.redirect('/login');
        });
    }

    listenPostEvent() {
        this.app.post('/login', (req, res) => this.attemptToLogin(req, res));
    }
}