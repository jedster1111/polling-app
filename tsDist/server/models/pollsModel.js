"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const pollsModel = database_1.default.addCollection("polls");
pollsModel.insert({ name: "test", creator: "Jed" });
pollsModel.insert({ name: "test2", creator: "Roy" });
exports.default = pollsModel;
