const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common,{
    mode: 'development',
    // In Chrome extensions, eval cannot be used, so source map is disabled
    devtool: false,
});
