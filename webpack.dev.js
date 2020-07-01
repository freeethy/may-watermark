var path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "watermark.js",
    library: "MayWaterMark",
    libraryTarget: "window",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
  },
  devServer: {
    open: true,
  },
};
