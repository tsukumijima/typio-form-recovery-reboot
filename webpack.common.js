const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        background: './src/js/controllers/background/backgroundController.js',
        content: './src/js/controllers/content/contentController.js',
        'content.frameInjector': './src/js/controllers/content.frameInjector/frameInjectorController.js',
        popup: './src/js/controllers/popupController/popupController.js',
        backendApp: './src/js/controllers/backendApp/backendApp.js',
        splash: './src/sass/splash.scss',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/js'),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(css|sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/manifest.json'),
                    to: path.resolve(__dirname, './dist'),
                },
                {
                    from: '*',
                    to: path.resolve(__dirname, './dist/img'),
                    context: 'src/img',
                },
                {
                    from: '**/*',
                    to: path.resolve(__dirname, './dist/fonts'),
                    context: 'src/fonts/',
                },
                {
                    from: '**/*',
                    to: path.resolve(__dirname, './dist/html'),
                    context: 'src/html/',
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),
    ]
};
