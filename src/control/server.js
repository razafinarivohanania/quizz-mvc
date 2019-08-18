'use strict';

const express = require('express');
const path = require('path');
const { SessionService } = require('../service/session-service');
const { SetLanguageController } = require('./set-language-controller');
const { HomeController } = require('./home-controller');
const { SignupController } = require('./signup-controller');
const { LoginController } = require('./login-controller');
const { getConfiguration } = require('../service/configuration');
const bodyParser = require('body-parser');

const app = express();

module.exports.runServer = async () => {
    const pathViews = path.resolve(__dirname, '..', 'view', 'ejs');
    const pathPublicFiles = path.resolve(__dirname, '..', 'view', 'public');
    const configuration = await getConfiguration();
    const sessionService = new SessionService(app, configuration);

    app.set('view engine', 'ejs');
    app.set('views', pathViews);
    app.use('/public', express.static(pathPublicFiles));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    new HomeController(app, sessionService, configuration).listenEvent();
    new LoginController(app, sessionService, configuration).listenEvent();
    new SignupController(app, sessionService, configuration).listenEvent();
    new SetLanguageController(app, sessionService).listenEvent();

    app.listen(
        configuration.server.port,
        () => console.log(`Server runs on port [${configuration.server.port}]`)
    );
}
