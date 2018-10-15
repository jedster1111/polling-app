const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const tsImportPluginFactory = require("ts-import-plugin");

module.exports = {
  entry: {
    app: ["./src/app/index.tsx", "webpack-hot-middleware/client"],
    vendor: ["react", "react-dom"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].bundle.js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      //   options: {
      //     transpileOnly: true,
      //     getCustomTransformers: () => ({
      //       before: [tsImportPluginFactory(/** options */)]
      //     }),
      //     compilerOptions: {
      //       module: "commonJs"
      //     }
      //   },
      //   exclude: /node_modules/
      // },
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
        ]
      }

      // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }

      // {
      //   loader: "style-loader"
      // },
      // {
      //   loader: "css-loader",
      //   options: {
      //     sourceMap: true
      //   }
      // }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "app", "index.html")
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  mode: "development",
  stats: { chunks: false, chunkModules: false }
};
