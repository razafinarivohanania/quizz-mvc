'use strict';

const path = require('path');
const { File } = require('./utils');

let configuration;

module.exports.getConfiguration = async () => {
    if (configuration)
        return configuration;

    const configurationPath = path.resolve(__dirname, '..', '..', 'configuration.json');
    const data = await File.read(configurationPath);
    return configuration = JSON.parse(data);
}