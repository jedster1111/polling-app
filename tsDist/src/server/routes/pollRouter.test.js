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
const request = require("supertest");
const app_1 = require("../app");
const pollsModel_1 = require("../models/pollsModel");
describe("Test GET /api/polls", () => {
    // adds test data before each test
    beforeEach(() => {
        pollsModel_1.default.insert({ name: "test", creator: "Jed" });
        pollsModel_1.default.insert({ name: "test2", creator: "Roy" });
    });
    afterEach(() => {
        // cleans up test data after each test
        pollsModel_1.default.removeDataOnly();
    });
    test("GET should respond with 200 and json in body", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app_1.default).get("/api/polls");
        const responseCleaned = response.body.map((poll) => {
            return { name: poll.name, creator: poll.creator };
        });
        expect(response.status).toBe(200);
        expect(responseCleaned).toMatchObject([
            { name: "test", creator: "Jed" },
            { name: "test2", creator: "Roy" }
        ]);
    }));
});
describe("Test POST /api/polls", () => {
    afterEach(() => {
        // cleans up test data after each test
        pollsModel_1.default.removeDataOnly();
    });
    test("tests if POST request with json adds to database", () => __awaiter(this, void 0, void 0, function* () {
        const inputData = { name: "testing", creator: "Joe" };
        const response = yield request(app_1.default)
            .post("/api/polls")
            .send(inputData)
            .set("Accept", "application/json")
            .expect(200);
        expect(response.body).toMatchObject(inputData);
    }));
});
