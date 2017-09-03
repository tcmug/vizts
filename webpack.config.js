
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const publicPath    = "";
const distPath      = path.resolve(__dirname, 'dist') + "/";
const indexTemplate = path.resolve(__dirname, 'static') + "/index.html";

module.exports = {
    devtool: 'source-map',
    entry: ['./src/app'],
    output: {
        path: distPath,
        publicPath: publicPath,
        filename: 'app.js'
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            inject: true,
            template: indexTemplate
        }),
        new HtmlWebpackHarddiskPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['ts-loader']
            }
        ]
    }
};
