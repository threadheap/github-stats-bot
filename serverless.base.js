'use strict';

const path = require('path');

module.exports = {
    provider: {
        name: 'aws',
        runtime: 'nodejs6.10',
        stage: '${opt:stage, "dev"}',
        region: '${opt:region, "us-east-1"}',
        memorySize: 128,
        timeout: 10,
        deploymentBucket: {
            name:
                'com.github-stats.${self:provider.region}.${self:provider.stage}.deploys'
        },
        environment: {
            BUCKET: 'com.github-stats.${self:provider.region}.${self:provider.stage}.images',
            GITHUB_TOKEN: '${env:GITHUB_TOKEN}'
        },
        iamRoleStatements: [{
            Effect: 'Allow',
            Action: [
                's3:ListBucket'
            ],
            Resource: ["arn:aws:s3:::com.github-stats.us-east-1.dev.images"]
        },{
            Effect: 'Allow',
            Action: [
                's3:PutObject',
                's3:GetObject'
            ],
            Resource: ["arn:aws:s3:::com.github-stats.us-east-1.dev.images/*"]
        }],
    },
    plugins: ['serverless-webpack']
};
