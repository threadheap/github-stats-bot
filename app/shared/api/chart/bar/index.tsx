import * as React from "react";
import { render } from "react-dom";
import { createDomForChart } from "../utils";
import Bars, { Data, Options } from "./component";

export default (data: Data, options: Options = {}): string => {
    const { target, dom } = createDomForChart();
    render(<Bars data={data} options={options} />, target);

    return dom.serialize();
};
