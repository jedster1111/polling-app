import path from "path";
import app from "./app";

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

app.listen(PORT, () => console.log(`App is running on port: ${PORT}`));
