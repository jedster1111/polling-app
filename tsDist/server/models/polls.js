"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loki = require("lokijs");
const db = new loki("polling-app.db");
const polls = db.addCollection("polls");
exports.default = db;
