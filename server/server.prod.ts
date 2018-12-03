import path from "path";
import app from "./app";
import db from "./models/database";

const PORT = process.env.PORT || 8000;
const ENV = process.env.NODE_ENV || "development";

console.log(`You are running in ${ENV} mode!`);

app.get("*", (req, res) => {
  if (ENV === "development") {
    res.sendFile(path.resolve(__dirname, "..", "dist", "index.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "..", "index.html"));
  }
});

const server = app.listen(PORT, () =>
  console.log(`App is running on port: ${PORT}`)
);

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  console.log("Saving database collections!");
  db.saveCollections(gracefulShutdown);

  function gracefulShutdown() {
    console.log("Shutting down the server gracefully!");
    server.close(() => {
      process.exit();
    });
  }
}
