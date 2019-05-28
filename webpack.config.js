var webpack = require('webpack');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'clean-css-loader'
                ]
            },
            {
                test: /.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: [
                        ['@babel/env', {
                            'targets': {
                                'browsers': ['last 5 versions']
                            },
                            'modules': false,
                        }],
                        '@babel/preset-react'
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
        new MiniCssExtractPlugin({
            filename: './bin/[name].css',  
        })
    ],
    optimization: {
        minimize: true
    },
    devtool: '#source-map',
    node: {
        fs: "empty"
    },
    stats: {
        warnings: false
    }
};