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
  resolve: {
    extensions: [".js", ".ts"],
    fallback: {
      path: require.resolve("path-browserify"),
      http: require.resolve("stream-http"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
  target: "node",
};
