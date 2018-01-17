import * as moment from "moment";
import * as request from "request-promise-native";

const BASE_URL = "https://api.github.com";

export interface Person {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: false;
}

export interface ContributorStats {
    author: Person;
    total: number;
    weeks: Array<{
        w: string;
        a: number;
        d: number;
        c: number;
    }>;
}

export interface CommitActivity {
    days: number[];
    total: number;
    week: number;
}

class GithubStatsApi {
    private _request: typeof request;

    constructor(token: string) {
        this._request = request.defaults({
            baseUrl: BASE_URL,
            headers: {
                Authorization: `token ${token}`,
                "User-Agent": "Stats Bot for Slack"
            },
            json: true
        });
    }

    public get request(): typeof request {
        return this._request;
    }

    public getContributorStats(repo: string): Promise<ContributorStats[]> {
        return this.request({
            url: `/repos/${repo}/stats/contributors`
        });
    }

    public getActivity(repo: string): Promise<CommitActivity[]> {
        return this.request({
            url: `/repos/${repo}/stats/commit_activity`
        });
    }
}

export default GithubStatsApi;
