const { merge } = require('webpack-merge');
const common = require('./webpack-front.common.config.js');

module.exports = merge(common, {
    mode: 'production',
});
