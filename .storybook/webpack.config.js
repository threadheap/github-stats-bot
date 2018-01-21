'use strict';

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader'
            }
        ]
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../app')
        },
        extensions: ['.tsx', '.ts', '.js', '.json']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new TsConfigPathsPlugin({
            configFileName: path.resolve('../tsconfig.json')
        })
    ]
};
