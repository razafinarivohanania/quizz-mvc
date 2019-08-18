'use strict';

const path = require('path');
const { File } = require('./utils');

const Language = {
    EN: 'en',
    FR: 'fr'
};

let translatorJson;

async function loadTranslateJson() {    
    const translatorPath = path.resolve(__dirname, '..', 'resource', 'translator.json');
    const data = await File.read(translatorPath);
    return JSON.parse(data);
}

module.exports.translate = async (text, langage = Language.EN) => {
    if (langage === Language.EN || !text)
        return text;

    if (!translatorJson)
        translatorJson = await loadTranslateJson();

    console.log('text : ' + text);
    return translatorJson[text][langage];
}

module.exports.Language = Language;

