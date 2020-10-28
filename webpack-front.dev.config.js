const { merge } = require('webpack-merge');
const common = require('./webpack-front.common.config.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './build/FE',
        compress: true,
        port: 9000

    },
});

