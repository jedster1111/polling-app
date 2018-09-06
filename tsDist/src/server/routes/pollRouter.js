"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    .post((req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("POST was called", req.body);
    const newPoll = req.body;
    yield pollsModel_1.default.insert(newPoll);
    console.log(pollsModel_1.default.find());
    res.status(200).send(newPoll);
}));
exports.default = pollRouter;
