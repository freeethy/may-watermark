var webpack = require("webpack");
var path = require("path");
var pkg = require("./package.json");

// 如果使用es6+语法可开启，编译成es5
const wpmodule = {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/env",
              {
                targets: {
                  ie: "9",
                  edge: "17",
                  firefox: "60",
                  chrome: "67",
                  safari: "11.1"
                }
              }
            ]
          ]
        }
      }
    }
  ]
};

module.exports = [
  // 通过window.WaterMark调用
  {
    mode: "production",
    entry: "./src/index.js",
    output: {
      filename: `watermark-${pkg.version}.min.js`,
      library: "MayWaterMark",
      libraryTarget: "window",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist/"
    }
    // module: wpmodule
  },
  // 通过require或import调用
  // 也可通过window.WaterMark调用，建议window直接调用使用上面生成的文件
  {
    mode: "production",
    entry: "./src/index.js",
    output: {
      filename: `watermark.js`,
      library: "MayWaterMark",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/dist/"
    },
    plugins: [new webpack.BannerPlugin({ banner: `v${pkg.version}` })]
    // module: wpmodule
  }
];
