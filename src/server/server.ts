import express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000;

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "hooray! welcome to our api" }));


app.listen(3000, () => console.log("App is running on port 3000"));

