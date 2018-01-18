import { TsConfigPathsPlugin } from "awesome-typescript-loader";
import * as path from "path";
import * as slsw from "serverless-webpack";

export default (basePath: string) => ({
    entry: slsw.lib.entries,
    bail: true,
    target: "node",
    context: basePath,
    node: {
        __filename: true,
        __dirname: true
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"],
        plugins: [new TsConfigPathsPlugin()]
    },
    externals: ["aws-sdk", "phantomjs-prebuilt"],
    output: {
        libraryTarget: "commonjs",
        path: path.join(basePath, ".webpack"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            { test: /\.ts(x?)$/, loader: "awesome-typescript-loader" }
        ]
    },
    devtool: "source-map"
});
