import { Callback, Context } from "aws-lambda";
import { S3 } from "aws-sdk";
import takeScreenshot from "./take-screenshot";

const bucketName = process.env.BUCKET as string;

interface Event {
    body: string;
}

interface Body {
    html: string;
    width: number;
    height: number;
    name: string;
}

const validateBody = (body: any): Body => {
    if (typeof body.html !== "string") {
        throw new Error("Unsupported html type");
    }
    if (typeof body.width !== "number" && typeof body.height !== "number") {
        throw new Error("Unsupported dimensions");
    }
    if (typeof body.name !== "string" && !body.name) {
        throw new Error("Name should be of type string and not empty");
    }

    return body as Body;
};

export const handler = async (
    event: Event,
    context: Context,
    callback: Callback
) => {
    try {
        const body = validateBody(event.body);

        const image = await takeScreenshot(body.html, body.width, body.height);
        const res = await new Promise((resolve, reject) => {
            const s3 = new S3({
                apiVersion: "2006-03-01",
                region: "us-east-1"
            });
            const params = {
                Bucket: bucketName,
                Key: body.name,
                Body: image,
                ContentEncoding: "base64",
                ContentType: "image/png"
            };
            s3.upload(
                params,
                (err: Error, uploadResult: { Location: string }) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({ imageUri: uploadResult.Location });
                }
            );
        });

        callback(null, res);
    } catch (err) {
        callback(err);
    }
};
