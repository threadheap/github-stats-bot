import renderBar from "@/shared/api/chart/bar"
import {createDomForChart} from "@/shared/api/chart/utils"
import GithubStatsApi, {ContributorStats} from "@/shared/api/gh-stats"
import { S3 } from "aws-sdk"
import takeScreenshot from "./take-screenshot"

const getAggregatedData = (data: ContributorStats[]) => {
    return data.map(item => {
        return {
            author: item.author.login,
            ...item.weeks.reduce((memo, week) => {
                return {
                    added: memo.added + week.a,
                    changed: memo.changed + week.c,
                    deleted: memo.deleted + week.d
                };
            }, {
                added: 0,
                changed: 0,
                deleted: 0
            })
        }
    })
}

export default async (repo: string, bucketName: string, token: string) => {
    const api = new GithubStatsApi(token)

    const data = await api.getContributorStats(repo)
    const fileName = `${repo.replace("/", "-")}-${Date.now()}.png`
    const { target, dom } = createDomForChart()

    renderBar(target, getAggregatedData(data))

    try {
        const image = await takeScreenshot(dom.serialize(), 500, 500);
        await new Promise((resolve, reject) => {
            const s3 = new S3({apiVersion: "2006-03-01", region: "us-east-1"})
            const params = {
                Bucket: bucketName,
                Key: fileName,
                Body: image,
                ContentEncoding: "base64",
                ContentType: "image/png",
            }
            s3.upload(params, (err, uploadResult) => {
                if (err) {
                    return reject(err)
                }
                resolve({imageUri: uploadResult.Location})
            })
        })
    } catch (err) {
        console.error(err)
        throw err
    }
}
