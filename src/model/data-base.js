'use strict';

const path = require('path');
const dbPath = path.resolve(__dirname, '..', '..', 'quizz.db');
const db = require('better-sqlite3')(dbPath);

db.exec('CREATE TABLE IF NOT EXISTS user (username TEXT, name TEXT, firstName TEXT, password TEXT, role INT)');

module.exports.db = db;