"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const app_1 = require("./app");
describe("Test the api route", () => {
    test("Is should respond with GET method", () => {
        return request(app_1.default)
            .get("/api/polls")
            .expect(200);
    });
});
