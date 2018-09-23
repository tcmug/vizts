const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FilePlugin = require("file-loader");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const publicPath = "";
const distPath = path.resolve(__dirname, "dist") + "/client/";
const indexTemplate = path.resolve(__dirname, "static") + "/index.html";
const assetsPath = path.resolve(__dirname, "assets") + "/";

const client = {
	mode: "development",
	devtool: "source-map",
	entry: ["./src/client/index"],
	output: {
		path: distPath,
		publicPath: publicPath,
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "./index.html",
			inject: true,
			template: indexTemplate
		})
		//new UglifyJSPlugin()
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: ["ts-loader"]
			},
			{
				test: require.resolve("snapsvg"),
				loader: "imports-loader?this=>window,fix=>module.exports=0"
			},
			{
				test: /\.sss$/,
				loaders: ["style-loader", "css-loader", "postcss-loader"]
			},
			{
				test: /\.(jpg|png|svg)$/,
				loader: "file-loader",
				include: assetsPath
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				loader: "file-loader",
				options: {
					name: "fonts/[name].[ext]"
				}
			}
		]
	}
};

module.exports = client;
