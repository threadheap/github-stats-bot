import {exec} from "child_process"
import * as path from "path"
const isOsx = Boolean(process.env.OSX as string);

const phantomJsPath = path.resolve(__dirname, "./phantomjs")
const PREFIX = "data:image/png;base64,"

export default (
    htmlString: string,
    width: number,
    height: number,
): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const cmd = [
                `${path.join(phantomJsPath, isOsx ? "phantomjs_osx" : "phantomjs_linux-x86_64")}`,
                "--debug=yes --ignore-ssl-errors=true",
                `${path.join(phantomJsPath, "./screenshot.js")}`,
                `"${encodeURI(htmlString)}" ${width} ${height}`
            ].join(" ")

            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    console.error(err, stdout, stderr);
                    return reject(err);
                }

                if (stdout.startsWith(PREFIX)) {
                    resolve(new Buffer(stdout.substring(PREFIX.length), "base64"))
                } else {
                    console.log(stdout, stderr);
                    reject(new Error("Unknown error"))
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}
