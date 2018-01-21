import * as jsdom from "jsdom";
import { DOMElement } from "react";

export function createDomForChart(): {
    dom: jsdom.JSDOM;
    target: DOMElement<any, any>;
} {
    const dom = new jsdom.JSDOM(`<body style="background: white;">
        <style>
            svg text {
                font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
                    monospace;
                fill: var(--chart-meta-color);
                font-size: 12px;
            }
        </style>
    </body>`);
    const div: DOMElement<any, any> = dom.window.document.createElement("div");
    dom.window.document.body.appendChild(div);

    return {
        target: div,
        dom
    };
}
