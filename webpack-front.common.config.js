const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:"./FE/index.ts",
    output:{
        filename: "bundle-front.js",
        path:path.resolve(__dirname, "build/FE")
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],

    module: {
        rules: [
            {
                test:/\.ts$/,
                exclude:/(node_modules)/,
                use: 'ts-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                exclude:/(node_modules)/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    }
}
