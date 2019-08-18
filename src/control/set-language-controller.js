const express = require('express');
const { SessionService } = require('../service/session-service');

module.exports.SetLanguageController = class SetLanguageController {

    constructor(app = express(), sessionService = new SessionService()) {
        this.app = app;
        this.sessionService = sessionService;
    }

    listenEvent() {
        this.app.get('/rest/set-language/:language', (req, res) => {
            try {
                this.sessionService.setLanguage(req, req.params.language);
                res.send({ success: true });
            } catch (error) {
                res.send({ success: false, error: `${error}` });
            }
        });
    }
}