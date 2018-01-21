import renderBar from "@/shared/api/chart/bar";
import * as AWS from "aws-sdk";
import generateContributorsStats, { Query } from "./get-contributors-stats";

const lambda = new AWS.Lambda();

const token = process.env.GITHUB_TOKEN as string;
const stage = process.env.STAGE as string;

export default async (repo: string, query: Query) => {
    const res = await generateContributorsStats(token, repo, query);
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

    return await lambda.invoke(params).promise();
};
