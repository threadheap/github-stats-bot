import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as path from "path";
import * as PermissionsOutputPlugin from "webpack-permissions-plugin";
import getBaseConfig from "../../webpack.dev";

const baseConfig = getBaseConfig(__dirname);

module.exports = Object.assign(
    {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: "phantomjs/phantomjs_linux-x86_64",
                    to: "phantomjs"
                },
                {
                    from: "phantomjs/screenshot.js",
                    to: "phantomjs"
                }
            ]),
            new PermissionsOutputPlugin({
                buildFiles: [
                    path.join(
                        baseConfig.output.path,
                        "service",
                        "phantomjs",
                        "phantomjs_linux-x86_64"
                    )
                ]
            })
        ]
    },
    baseConfig
);
