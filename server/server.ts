import * as path from "path";
import * as webpack from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as webpackConfig from "../webpack.config.js";
import app from "./app";

const compiler = webpack(webpackConfig as any);
app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is running on port: ${port}`));
