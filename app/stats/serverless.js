const baseConfig = require('../../serverless.base');
const { defaultsDeep } = require('lodash');

module.exports = defaultsDeep(
    {
        service: 'git-stats',
        provider: {
            iamRoleStatements: [
                ...baseConfig.provider.iamRoleStatements,
                {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: ['*']
                }
            ]
        },
        functions: {
            getContributorStatsImage: {
                name: '${self:provider.stage}-getContributorStatsImage',
                handler: 'index.handler',
                events: [
                    {
                        http: {
                            path: '/stats/contributors/{owner}/{repo}',
                            method: 'get',
                            parameters: {
                                paths: {
                                    owner: true,
                                    repo: true
                                },
                                querystrings: {
                                    start: false,
                                    end: false
                                }
                            }
                        }
                    }
                ],
                memorySize: 256,
                timeout: 30
            }
        },
        custom: {
            webpack: './webpack.config.ts'
        }
    },
    baseConfig
);
