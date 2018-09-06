import uuid = require("uuid/v1");
import db from "./database";

const pollsModel = db.addCollection("polls");
// pollsModel.insert({ name: "test", creator: "Jed" });
// pollsModel.insert({ name: "test2", creator: "Roy" });

export default pollsModel;
