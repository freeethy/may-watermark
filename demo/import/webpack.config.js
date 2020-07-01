let webpack = require("webpack");
var path = require("path");

module.exports = {
  mode: "production",
  entry: {
    watermark: "./src/app.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js"
  }
}
