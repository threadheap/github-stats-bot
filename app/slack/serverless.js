const baseConfig = require('../../serverless.base');
const { defaultsDeep } = require('lodash');

module.exports = defaultsDeep(
    {
        service: 'git-stats-slack',
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
            eventHandler: {
                name: '${self:provider.stage}-slackEventHandler',
                handler: 'index.handler',
                events: [
                    {
                        http: {
                            path: '/stats/slack/event-handler',
                            method: 'post'
                        }
                    }
                ]
            }
        },
        custom: {
            webpack: './webpack.config.ts'
        }
    },
    baseConfig
);
