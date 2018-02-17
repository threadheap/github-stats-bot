import { Callback, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as request from "request-promise-native";

const lambda = new AWS.Lambda();

const stage = process.env.STAGE as string;
const slackToken = process.env.SLACK_TOKEN as string;

interface Event {
    body: string;
}

interface MentionEvent {
    token: string;
    team_id: string;
    api_app_id: string;
    event: {
        type: "app_mention";
        user: string;
        text: string;
        ts: string;
        channel: string;
        event_ts: string;
    };
}

interface VerificationEvent {
    type: "url_verification";
    token: string;
    challenge: string;
}

type Body = MentionEvent | VerificationEvent;

const repoRegExp = /([\w-]+\/[\w-]+)/;

export const handler = async (
    event: Event,
    context: Context,
    callback: Callback
) => {
    try {
        const slackEvent: Body = JSON.parse(event.body);

        if ("type " in slackEvent) {
            callback(null, {
                body: JSON.stringify({
                    challenge: (slackEvent as VerificationEvent).challenge
                }),
                statusCode: 200
            });
        } else {
            const mentionEvent = (slackEvent as MentionEvent).event;

            if (mentionEvent.type === "app_mention") {
                callback(null, { body: "OK", statusCode: 200 });

                const message = mentionEvent.text;
                const parts = repoRegExp.exec(message);
                if (parts) {
                    const repo = parts[1];

                    const params = {
                        FunctionName: `${stage}-getContributorStatsImage`,
                        InvocationType: "RequestResponse",
                        LogType: "Tail",
                        Payload: JSON.stringify({
                            repo
                        })
                    };

                    const response = await lambda.invoke(params).promise();
                    const payload = JSON.parse(response.Payload);

                    const message = {
                        channel: mentionEvent.channel,
                        text: "Contributor stats",
                        attachments: [
                            {
                                title: `Contributor stats for ${repo} repository`,
                                image_url: payload.imageUri
                            }
                        ]
                    };

                    await request({
                        url: "https://slack.com/api/chat.postMessage",
                        method: "post",
                        json: true,
                        headers: {
                            Authorization: `Bearer ${slackToken}`,
                            "User-Agent": "Stats Bot for Slack"
                        },
                        body: message
                    });
                } else {
                    throw new Error("Can not recognize repository name");
                }
            } else {
                throw new Error("Unknown event type");
            }
        }
    } catch (err) {
        callback(err);
    }
};
