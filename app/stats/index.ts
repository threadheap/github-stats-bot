import renderBar from "@/shared/api/chart/bar";
import { Callback, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import generateContributorsStats, { Query } from "./get-contributors-stats";

const lambda = new AWS.Lambda();
const token = process.env.GITHUB_TOKEN as string;
const stage = process.env.STAGE as string;

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
        const res = await generateContributorsStats(
            token,
            repo,
            getQuery(event.queryStringParameters)
        );
        const params = {
            FunctionName: `${stage}-renderToPng`,
            InvocationType: "RequestResponse",
            LogType: "Tail",
            Payload: JSON.stringify({
                body: {
                    html: renderBar(res),
                    width: 600,
                    height: 300,
                    name: `${repo}-contributors-${Date.now()}.png`
                }
            })
        };

        const data = await lambda.invoke(params).promise();
        callback(null, {
            statusCode: 200,
            body: data.Payload
        });
    } catch (err) {
        callback(err);
    }
};
