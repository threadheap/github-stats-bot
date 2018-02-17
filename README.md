# github-stats-bot

Github stats rendering service
Written in typescript using [serverless framework](https://serverless.com/), [phantomjs](http://phantomjs.org/) and [nivo](http://nivo.rocks/#/).

## How to use

1. Clone repo
2. Go to repo root folder
3. Run

```sh
yarn
```

4. Change deployment bucket in `serverless.base.js`
5. Install [serverless framework](https://serverless.com/) and [serviceless cli tool](https://github.com/threadheap/serviceless)
   (You'll also have to configure your AWS credentials, see [quick-start](https://serverless.com/framework/docs/providers/aws/guide/quick-start/))

```sh
yarn add -g serverless
yarn add -g serviceless
```

6. To deploy run

```sh
sudo GITHUB_TOKEN=<github_token> SLACK_TOKEN=<slack_token> slx deploy all
```

## LICENCE

MIT [@pavelvlasov](https://github.com/pavelvlasov)
