
const path = require('path');
const NodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const publicPath    = "";
const distPath      = path.resolve(__dirname, 'dist') + "/server/";
const indexTemplate = path.resolve(__dirname, 'static') + "/index.html";


const server = { 
    target: 'node',
    devtool: 'source-map',
    entry: [
        './src/server/app',
    ],
    output: {
        path: distPath,
        filename: 'server.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
        new NodemonPlugin(),
        //new UglifyJSPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: ['ts-loader']
            }
        ]
    },
    externals: [
        NodeExternals()
    ]
};

module.exports = server;
