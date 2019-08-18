'use strict';

const express = require('express');
const path = require('path');
const { translate } = require('../service/translator');
const { SessionService } = require('../service/session-service');
const { SignupModel } = require('../model/signup-model');
const { FullView } = require('../view/full-view');

module.exports.SignupController = class SignupController {

    constructor(app = express(), sessionService = new SessionService(), configuration = {}) {
        this.app = app;
        this.sessionService = sessionService;
        this.configuration = configuration;
    }

    async buildBodySignupParameters(req, notification) {
        const language = this.sessionService.getLanguage(req);

        if (notification)
            notification = await translate(notification, language);

        const name = await translate('Name', language);
        const firstName = await translate('First name', language);
        const username = await translate('Username', language);
        const password1 = await translate('Password', language);
        const password2 = await translate('Repeat password', language);
        const hasAccount = await translate('I have account', language);
        const signup = await translate('Signup', language);

        return {
            notification: notification,
            name: name,
            firstName: firstName,
            username: username,
            password1: password1,
            password2: password2,
            hasAccount: hasAccount,
            signup: signup
        }
    }

    async loadSignupPage(req, res, notification = '') {
        const bodySignupFilePath = path.resolve(__dirname, '..', 'view', 'ejs', 'signup.ejs');
        const bodySignupParameters = await this.buildBodySignupParameters(req, notification);

        const fullView = new FullView(req, res, this.sessionService, this.configuration);

        await fullView.addDefaultHead();
        await fullView.addBody(bodySignupFilePath, bodySignupParameters);
        await fullView.addDefaultFoot();

        fullView.render();
    }

    async attemptToSignup(req, res) {
        const signupModel = new SignupModel(req.body.name, req.body.firstName, req.body.username, req.body.password1, req.body.password2, this.configuration);

        if (!signupModel.hasName()){
            await this.loadSignupPage(req, res, 'Name is empty');
            return;
        }

        if (!signupModel.hasFirstName()){
            await this.loadSignupPage(req, res, 'First name is empty');
            return;
        }

        if (!signupModel.hasUsername()) {
            await this.loadSignupPage(req, res, 'Username is empty');
            return;
        }

        if (!signupModel.hasPassword1()) {
            await this.loadSignupPage(req, res, 'Password is empty');
            return;
        }

        if (!signupModel.hasPassword2()) {
            await this.loadSignupPage(req, res, 'Repeated password is empty');
            return;
        }

        if (!signupModel.arePasswordsSame()) {
            await this.loadSignupPage(req, res, 'Password is different than repeated password');
            return;
        }

        if (signupModel.doesUsernameExist()){
            await this.loadSignupPage(req, res, 'Username already exists');
            return;
        }

        signupModel.addUser();
        res.redirect(`/login`);
    }

    listenEvent(){
        this.listenGetEvent();
        this.listenPostEvent();
    }

    listenGetEvent() {
        this.app.get('/signup', async (req, res) => {
            if (this.sessionService.isLogged(req))
                res.redirect('/');
            else
                await this.loadSignupPage(req, res)
        });
    }

    listenPostEvent() {
        this.app.post('/signup', (req, res) => this.attemptToSignup(req, res));
    }
}