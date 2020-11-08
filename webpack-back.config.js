const path = require("path");

module.exports = {
  entry: "./BE/index.ts",
  output: {
    filename: "bundle-back.js",
    path: path.resolve(__dirname, "build/BE"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: "ts-loader",
      },
    ],
  },
};
