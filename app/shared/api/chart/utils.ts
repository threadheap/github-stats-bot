import * as jsdom from "jsdom"

export function createDomForChart(): any {
    const dom = new jsdom.JSDOM(`<body></body>`)
    const div = dom.window.document.createElement("div")
    dom.window.document.body.appendChild(div)

    return {
        target: div,
        dom
    }
}
