const baseConfig = require('../../serverless.base');
const { defaultsDeep } = require('lodash');

module.exports = defaultsDeep(
    {
        service: 'html-to-png',
        functions: {
            renderToPng: {
                name: '${self:provider.stage}-renderToPng',
                handler: 'index.handler',
                description: 'render input html to png and put into S3 bucket',
                memorySize: 512,
                timeout: 30
            }
        },
        custom: {
            webpack: './webpack.config.ts'
        }
    },
    baseConfig
);
