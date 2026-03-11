const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common,{
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        // Alternative to strip-loader: remove console.log and console.trace
                        pure_funcs: ['console.log', 'console.trace'],
                    },
                },
            }),
        ],
    },
});
