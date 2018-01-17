import { Calendar } from "@/shared/api/chart/calendar"
import { storiesOf } from "@storybook/react"
import * as React from "react"
import data from "./calendar.data"

storiesOf("heatmap calendar", module).add("default", () => {
    return <Calendar data={data} />
})
