import path = require("path");
import webpack = require("webpack");
import webpackDevMiddleware = require("webpack-dev-middleware");
import webpackHotMiddleware = require("webpack-hot-middleware");
import webpackConfig = require("../webpack.config.js");
import app from "./app";

const compiler = webpack(webpackConfig as any);
app.use(
  webpackDevMiddleware(compiler, {
    logLevel: "warn",
    publicPath: webpackConfig.output.publicPath
  })
);
app.use(webpackHotMiddleware(compiler));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is running on port: ${port}`));
