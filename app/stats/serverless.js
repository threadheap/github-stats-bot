const baseConfig = require('../../serverless.base');
const defaultsDeep = require('lodash.defaultsdeep');

module.exports = defaultsDeep({
    service: 'git-stats',
    functions: {
        getContributorStats: {
            name: '${self:provider.stage}-getContributorStats',
            handler: 'index.handler',
            description: 'generate contributor stats image',
            events: [{
                http: {
                    method: 'get',
                    path: '/stats/{owner}/{repo}',
                    request: {
                        parameters: {
                            path: {
                                owner: true,
                                repo: true
                            }
                        }
                    }
                }
            }],
            memorySize: 512,
            timeout: 30,
        }
    },
    custom: {
        webpack: './webpack.dev.js'
    }
}, baseConfig);
