const path = require("path");
const include = path.resolve(__dirname, "../");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
          // {
          //   loader: "less-loader",
          //   options: {
          //     root: path.resolve(__dirname, "./")
          //   }
          // }
        ],
        include
      }
    ]
  }
};
