import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "../webpack.config.js";
import app from "./app";
import db from "./models/database";

const PORT = process.env.PORT || 8000;
const ENV = process.env.NODE_ENV || "development";

console.log(`You are running in ${ENV} mode!`);

if (ENV === "development") {
  console.log("hot module and dev middleware is loaded");
  const compiler = webpack(webpackConfig as any);
  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));
}
app.get("*", (req, res) => {
  if (ENV === "development") {
    res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "..", "index.html"));
  }
});
// if (ENV === "development") {
//   app.use(express.static(`${__dirname}/../dist/index.html`));
// } else {
//   app.use(express.static(`${__dirname}/../index.html`));
// }

const server = app.listen(PORT, () =>
  console.log(`App is running on port: ${PORT}`)
);

const saveInterval = setInterval(() => db.saveCollections(), 8000);

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("Saving database collections!");
  db.saveCollections(gracefulShutdown);
  clearInterval(saveInterval);

  function gracefulShutdown() {
    console.log("Shutting down the server gracefully!");
    server.close(() => {
      process.exit();
    });
  }
}
