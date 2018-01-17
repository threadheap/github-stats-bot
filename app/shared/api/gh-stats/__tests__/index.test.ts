import * as nock from "nock";
const GithubStatsApi = require("../index").default;

describe("GithubStatsApi", () => {
    const api = new GithubStatsApi("foo");
    const repo = "threadheap/serviceless";

    it(
        "should contributor stats",
        async () => {
            const contributorsStats = nock("https://api.github.com")
            .get("/repos/threadheap/serviceless/stats/contributors").reply(200, [{
                author: {
                    id: "pavelvlasov"
                },
                total: 5,
                weeks: [{
                    w: "1",
                    a: 10,
                    d: 10,
                    c: 10
                }]
            }]);

            const stats = await api.getContributorStats(repo);

            expect(stats.length).toBeGreaterThan(0);
            expect(contributorsStats.isDone()).toBe(true);
        }
    );

    it(
        "should return activity",
        async () => {
            const activityStats = nock("https://api.github.com")
            .get("/repos/threadheap/serviceless/stats/commit_activity").reply(200, [{
                days: [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                ],
                total: 10,
                week: 5
            }]);

            const stats = await api.getActivity(repo);

            expect(stats.length).toBeGreaterThan(0);
            expect(activityStats.isDone()).toBe(true);
        }
    );
});
