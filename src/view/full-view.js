
'use strict';

const path = require('path');
const ejs = require('ejs');
const { File } = require('../service/utils');
const { LanguageView } = require('./language-view');
const { SessionService } = require('../service/session-service');
const { translate } = require('../service/translator');

module.exports.FullView = class FullView {

    constructor(req, res, sessionService = new SessionService(), configuration = {}) {
        this.req = req;
        this.res = res;
        this.sessionService = sessionService;
        this.configuration = configuration;
        this.scripts = [];
        this.head = '';
        this.body = '';
        this.foot = '';
    }

    async addDefaultHead() {
        const pathHead = path.resolve(__dirname, 'ejs', 'head.ejs');
        const headFileContent = await File.read(pathHead);
        const languageHtml = await new LanguageView(this.req, this.sessionService).buildHtml();
        const language = this.sessionService.getLanguage(this.req);
        const noScriptMessage = await translate('JavaScript is disabled', language);
        const headParameters = {
            title: this.configuration.window.title,
            noScriptMessage: noScriptMessage,
            languageHtml: languageHtml
        }

        this.head = ejs.render(headFileContent, headParameters);
        this.addScript('/public/js/language.js');
    }

    async addBody(bodyFilePath, bodyParameters) {
        const bodyFileContent = await File.read(bodyFilePath);
        this.body = ejs.render(bodyFileContent, bodyParameters)
    }

    async addDefaultFoot() {
        const pathFoot = path.resolve(__dirname, 'ejs', 'foot.ejs');
        const footFileContent = await File.read(pathFoot);

        this.addScript('/public/js/button-to-link.js');
        this.addScript('/public/js/display-content.js');
        this.foot = ejs.render(footFileContent, { scripts: this.scripts });
    }

    addScript(scriptSrc) {
        this.scripts.push(scriptSrc);
    }

    render() {
        this.res.type('html');
        const html = `${this.head}${this.body}${this.foot}`;
        this.res.send(html);
    }
};