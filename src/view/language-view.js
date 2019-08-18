'use strict';

const ejs = require('ejs');
const path = require('path');
const { SessionService } = require('../service/session-service');
const { Language, translate } = require('../service/translator');
const { File } = require('../service/utils');

module.exports.LanguageView = class LanguageView {

    constructor(req, sessionService = new SessionService()) {
        this.req = req;
        this.sessionService = sessionService;
    }

    buildLanguageHtmlId(language){
        return `quizz-language-${language}`;
    }

    async buildLanguageParameters() {
        const language = this.sessionService.getLanguage(this.req);
        const languages = [
            {
                code: Language.EN,
                htmlId: this.buildLanguageHtmlId(Language.EN),
                value: 'English'
            },
            {
                code: Language.FR,
                htmlId: this.buildLanguageHtmlId(Language.FR),
                value: 'Français'
            }
        ];

        for (const currentLanguage of languages) {
            if (currentLanguage.code === language) {
                currentLanguage.isSelected = true;
                break;
            }
        }

        const changeLanguage = await translate('Change language', language);
        return {
            changeLanguage: changeLanguage,
            languages: languages
        };
    }

    async buildHtml() {
        const languagePath = path.resolve(__dirname, 'ejs', 'language.ejs');
        const languageFile = await File.read(languagePath);
        const languageParameters = await this.buildLanguageParameters();
        return ejs.render(languageFile, languageParameters);
    }
};