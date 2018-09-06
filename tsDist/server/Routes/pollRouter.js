"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const pollsModel_1 = require("../models/pollsModel");
const pollRouter = express.Router();
pollRouter.route("/").get((req, res) => {
    const poll = pollsModel_1.default.findOne({ name: "test2" });
    console.log(poll);
});
exports.default = pollRouter;
