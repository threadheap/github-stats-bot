import GithubStatsApi, { ContributorStats } from "@/shared/api/gh-stats";
import { sortBy } from "lodash";

export interface Query {
    start?: number;
    end?: number;
}

const getAggregatedData = (data: ContributorStats[], query: Query) => {
    return sortBy(
        data.map(item => {
            let weeks = item.weeks;

            if (query.start || query.end) {
                const start = query.start || 0;
                const end = query.end || Number.MAX_VALUE;
                weeks = weeks.filter(
                    week => Number(week.w) > start && Number(week.w) < end
                );
            }

            return {
                author: item.author.login,
                ...weeks.reduce(
                    (memo, week) => {
                        return {
                            added: memo.added + week.a,
                            changed: memo.changed + week.c,
                            deleted: memo.deleted + week.d
                        };
                    },
                    {
                        added: 0,
                        changed: 0,
                        deleted: 0
                    }
                )
            };
        }),
        item => item.added + item.changed + item.deleted
    ).slice(0, 5);
};

export default async (token: string, repo: string, query: Query = {}) => {
    const api = new GithubStatsApi(token);
    const data = await api.getContributorStats(repo);
    return getAggregatedData(data, query);
};
