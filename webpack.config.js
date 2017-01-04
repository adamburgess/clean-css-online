var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        build: './lib/main.js',
        'build-worker': './lib/worker.js'
    },
    output: {
            path: __dirname,
            filename: "./bin/[name].js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallbackLoader: "style-loader",
                loader: "css-loader"
            }) },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [
                        ['env', {
                            'targets': {
                                'browsers': ['last 5 versions']
                            },
                            'modules': false,
                        }],
                        'react'
                    ]
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new ExtractTextPlugin('./bin/build.css')
    ],
    devtool: '#source-map',
    node: {
        fs: "empty"
    },
    stats: {
        warnings: false
    }
};