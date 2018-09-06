"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const pollsModel_1 = require("../models/pollsModel");
const pollRouter = express.Router();
pollRouter
    .route("/")
    .get((req, res) => {
    const polls = pollsModel_1.default.find();
    console.log("/api/polls was accessed");
    res.json(polls);
})
    .post((req, res) => {
    console.log(req.body);
    const newPoll = req.body;
    pollsModel_1.default.insert(newPoll);
    res.status(200).send(pollsModel_1.default.find({ name: req.body.name }));
});
exports.default = pollRouter;
