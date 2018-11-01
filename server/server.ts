import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "../webpack.config.js";
import app from "./app";

const PORT = process.env.PORT || 8000;
const ENV = process.env.NODE_ENV || "development";

console.log(`You are running in ${ENV} mode!`);

if (ENV === "development") {
  console.log("hot module and dev middleware is loaded");
  const compiler = webpack(webpackConfig as any);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: "/assets/",
      watchOptions: { poll: false },
      stats: "minimal"
    })
  );
  app.use(webpackHotMiddleware(compiler));
}
app.get("*", (req, res) => {
  if (ENV === "development") {
    res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "..", "index.html"));
  }
});

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
