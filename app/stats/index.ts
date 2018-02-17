import { Callback, Context } from "aws-lambda";
import fetchImage from "./fetch-image";

interface Event {
    repo: string;
    start?: number;
    end?: number;
}

export const handler = async (
    event: Event,
    context: Context,
    callback: Callback
) => {
    try {
        const data = await fetchImage(event.repo, event);

        callback(null, JSON.parse(data.Payload));
    } catch (err) {
        callback(err);
    }
};
