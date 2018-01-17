import { Bars } from "@/shared/api/chart/bar"
import { storiesOf } from "@storybook/react"
import * as React from "react"
import data from "./bars.data"

storiesOf("bars chart", module).add("default", () => {
    return (
        <Bars data={data} />
    )
})
