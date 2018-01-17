'use strict';

const path = require('path');
const slsw = require('serverless-webpack');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PermissionsOutputPlugin = require('webpack-permissions-plugin');

const entries = {};
Object.keys(slsw.lib.entries).forEach(entryName => {
    const entry = slsw.lib.entries[entryName];

    entries[entryName] = [path.join(__dirname, '../../webpack/inject.js'), entry];
});

const outputPath = path.join(__dirname, '.webpack');

module.exports = {
    entry: entries,
    bail: true,
    target: 'node',
    context: __dirname,
    node: {
        __filename: true,
        __dirname: true
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
        plugins: [new TsConfigPathsPlugin()]
    },
    externals: ['aws-sdk', 'phantomjs-prebuilt'],
    output: {
        libraryTarget: 'commonjs',
        path: outputPath,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            { test: /\.ts(x?)$/, loader: 'awesome-typescript-loader' },
        ]
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([{
            from: 'phantomjs/phantomjs_linux-x86_64',
            to: 'phantomjs'
        }, {
            from: 'phantomjs/screenshot.js',
            to: 'phantomjs'
        }]),
        new PermissionsOutputPlugin({
            buildFiles: [
                path.join(outputPath, 'service', 'phantomjs', 'phantomjs_linux-x86_64')
            ]
        })
    ],
};
