import { Callback, Context } from "aws-lambda"
import generateContributorsStats from "./generate-contributors-stats"

const bucketName = (process.env.BUCKET as string)
const token = (process.env.GITHUB_TOKEN as string)

interface Event {
    pathParameters: {
        owner: string,
        repo: string,
    };
}

export const handler = async (event: Event, context: Context, callback: Callback) => {
    try {
        const res = await generateContributorsStats(
            `${event.pathParameters.owner}/${event.pathParameters.repo}`,
            bucketName,
            token
        );
        callback(null, {statusCode: 200, body: JSON.stringify(res)})
    } catch (err) {
        callback(err)
    }
}
