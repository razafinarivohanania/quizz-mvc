'use strict';

const express = require('express');
const path = require('path');
const { translate } = require('../service/translator');
const { SessionService } = require('../service/session-service');
const { FullView } = require('../view/full-view');

module.exports.HomeController = class HomeController {

    constructor(app = express(), sessionService = new SessionService(), configuration = {}) {
        this.app = app;
        this.sessionService = sessionService;
        this.configuration = configuration;
    }

    getUserFullName(req) {
        if (this.sessionService.isLogged(req)) {
            const user = this.sessionService.getUser(req);
            return `${user.name} ${user.firstName}`;
        }
    }

    async buildBodyHomeParameters(req) {
        const language = this.sessionService.getLanguage(req);
        let home = await translate('Welcome', language);

        const userFullName = this.getUserFullName(req);
        if (userFullName)
            home += ` ${userFullName}`;

        home += ' ';
        home += await translate('to', language);
        home += ` "${this.configuration.window.title}"`;

        const begin = await translate('Begin', language);
        return {
            home: home,
            begin: begin
        }
    }

    async loadHomePage(req, res) {
        const bodyHomeFilePath = path.resolve(__dirname, '..', 'view', 'ejs', 'home.ejs');
        const bodyHomeParameters = await this.buildBodyHomeParameters(req);

        const fullView = new FullView(req, res, this.sessionService, this.configuration);

        await fullView.addDefaultHead();
        await fullView.addBody(bodyHomeFilePath, bodyHomeParameters);
        await fullView.addDefaultFoot();

        fullView.render();
    }

    listenEvent() {
        this.app.get('/', async (req, res) => await this.loadHomePage(req, res));
    }
}