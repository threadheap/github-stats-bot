import * as jsdom from "jsdom";
import { DOMElement } from "react";

export function createDomForChart(): {
    dom: jsdom.JSDOM;
    target: DOMElement<any, any>;
} {
    const dom = new jsdom.JSDOM(`<body></body>`);
    const div: DOMElement<any, any> = dom.window.document.createElement("div");
    dom.window.document.body.appendChild(div);

    return {
        target: div,
        dom
    };
}
