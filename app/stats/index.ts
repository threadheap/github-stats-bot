import { Callback, Context } from "aws-lambda";
import fetchImage from "./fetch-image";
import { Query } from "./get-contributors-stats";

interface QueryStringParameters {
    start?: string;
    end?: string;
}

interface Event {
    pathParameters: {
        owner: string;
        repo: string;
    };
    queryStringParameters?: QueryStringParameters;
}

const getQuery = (queryStringParameters?: QueryStringParameters) => {
    const query: Query = {};

    if (queryStringParameters) {
        if (queryStringParameters.start) {
            query.start = Number(queryStringParameters.start);
        }
        if (queryStringParameters.end) {
            query.end = Number(queryStringParameters.end);
        }
    }

    return query;
};

export const handler = async (
    event: Event,
    context: Context,
    callback: Callback
) => {
    try {
        const repo = `${event.pathParameters.owner}/${
            event.pathParameters.repo
        }`;

        const data = await fetchImage(
            repo,
            getQuery(event.queryStringParameters)
        );

        callback(null, {
            statusCode: 200,
            body: data.Payload
        });
    } catch (err) {
        callback(err);
    }
};
