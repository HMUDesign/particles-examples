const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

function addPolyfill(input) {
	if (typeof input === 'string') {
		return [ 'babel-polyfill', input ];
	}

	if (input.constructor === Array) {
		return [ 'babel-polyfill' ].concat(input);
	}

	let output = {};

	for (let key in input) {
		output[key] = addPolyfill(input[key]);
	}

	return output;
}

module.exports = function(dirname, options) {
	if (typeof options.dev === 'undefined') {
		options.dev = process.argv.includes('--watch');
	}

	options.title = options.title || 'App';
	options.resolve_alias = options.resolve_alias || {};

	options.entry = options.entry || './src/bootstrap.js';

	if (options.polyfill) {
		options.entry = addPolyfill(options.entry);
	}

	return {
		devtool: options.dev ? 'eval' : 'source-map',

		entry: options.entry,
		output: {
			filename: '[name].[hash].min.js',
			path: path.resolve(dirname, 'build'),
			publicPath: '/',
		},

		resolve: {
			alias: options.resolve_alias,
			modules: [ path.resolve(dirname, 'vendor'), 'node_modules' ],
		},

		module: {
			rules: [
				{
					test: /\.(webm|woff|woff2|ttf|eot|jpg|png|gif|svg)(\?.*)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: 'assets/[hash].[ext]',
							},
						},
					],
				},
				{
					test: /\.glsl$/,
					use: [
						'./lib/webpack/glsl-loader',
					],
				},
				{
					test: /\.js$/,
					include: path.resolve(dirname, 'src'),
					use: [
						'babel-loader',
					],
				},

				{
					test: /\.s?css$/,
					use: ExtractTextPlugin.extract({
						use: [
							{
								loader: 'css-loader',
								options: {
									modules: true,
									localIdentName: options.dev
										? '[path][name]__[local]'
										: '[hash:base64:8]',
									sourceMap: true,
									sourceMapContents: true,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									// importLoaders: 1,
									sourceMap: true,
									plugins: (loader) => [
										require('autoprefixer')({
											browsers: [ '> 1%', 'last 3 versions' ],
										}),
									],
								},
							},
						],
					}),
				},
				{
					test: /\.scss$/,
					use: [
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true,
								sourceMapContents: true,
							},
						},
						{
							loader: 'sass-resources-loader',
							options: {
								resources: path.resolve(dirname, './public-src/resources.scss'),
							},
						},
					],
				},
			],
		},

		plugins: [
			new ExtractTextPlugin('[name].[hash].min.css'),
			options.dev ? null : new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
				sourceMapContents: true,
			}),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(options.dev
					? 'development'
					: 'production'
				),
			}),
			new HtmlWebpackPlugin({
				title: options.title,
				filename: 'index.html',
				minify: {
					collapseWhitespace: !options.dev,
				},
				template: path.join(__dirname, options.dev
					? 'template.dev.ejs'
					: 'template.prod.ejs'
				),
			}),
		].filter(v => v),
	};
};
