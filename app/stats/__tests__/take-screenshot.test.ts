import renderBar from "@/shared/api/chart/bar"
import {createDomForChart} from "@/shared/api/chart/utils"
import * as fs from "fs"
import * as path from "path"

const writeImageToFile = (name: string, buffer: Buffer) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, buffer, "base64", (err) => {
            if (err) { return reject(err) }
            resolve()
        })
    })
}

describe("takeScreenshot", () => {
    beforeAll(() => {
        process.env.OSX = "osx"
    })

    // afterEach(() => {
    //     fs.unlinkSync(filename)
    // })

    afterAll(() => {
        delete process.env.OSX
    })

    it("should generate screenshot", () => {
        expect.assertions(1)
        const takeScreenshot = require("../take-screenshot").default

        return takeScreenshot(
            "<html><body>Hello world</body></html>",
            300,
            300,
        ).then((image) => {
            expect(image).toBeDefined()
            return writeImageToFile("test1.png", image)
        })
    }, 20000)

    it("should generate chart screenshot", () => {
        expect.assertions(1)
        const {target, dom} = createDomForChart()
        renderBar(target, [{author: "foo", added: 10, deleted: 10, changed: 10}])

        const takeScreenshot = require("../take-screenshot").default

        console.log(dom.serialize())

        return takeScreenshot(
            dom.serialize(),
            600,
            300,
        ).then((image) => {
            expect(image).toBeDefined()
            return writeImageToFile("test2.png", image)
        })
    }, 20000)
});
