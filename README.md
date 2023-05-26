# App's Demo

![Demo](/public/demo.gif)

## What is Monoripify?

Monoripify is a CI/CD web application simplify the management of your monorepos. With valuable insights into your build process, allowing you to optimize your workflows. We also enable you to deploy your apps and packages to your desired host provider, providing flexibility and convenience for your development projects.

### Caveats

Be advised that Monoripify has certain constraints that must be considered before setup the projet:

1. You must select a Public repo for the build process.
2. It's necessary for your repo to have pnpm as a package manager, as well as the  pnpm-lock.yml file.
3. The inability to utilize environment variables for the build process.
4. Currently, you are only able to deploy your projects using Railway.

**These are the primary constraints that I need to address and overcome.**

## How to get started

### Fork the repo and set the environment variables

1. [Fork the repository](https://docs.github.com/pull-requests/collaborating-with-pull-requests/working-with-forks/about-forks) so you can have your own copy of it.
2. Set up this enviroment variables:

```txt
# Github App credentials
APP_ID=
WEBHOOK_SECRET_TOKEN=
PRIVATE_KEY=

# Github App Client
NEXT_PUBLIC_GITHUB_APP_CLIENT_ID=
GITHUB_APP_CLIENT_SECRET=

# Next-Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# OpenAI
OPENAI_API_KEY=

# Websocket
PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=

# Railway
NEXT_PUBLIC_RAILWAY_TOKEN=
```

Setting up the **NEXTAUTH_URL** is crucial since this is the URL that is used by the Github actions to send the logs data. With this variable the Github Action workflow will fail. In a development environment to recieve this logs you should set up a funnel, I use [Ngrok](https://ngrok.com/).

PS: I'm looking for ways to not rely on third-party services such as *Pusher*. If you have any recommendations for **alternative open source solutions**, I would greatly appreciate your suggestions. Thank you in advance for your input and recommendations.

## Questions? Comments? Feedback?

Please open an [Issue](https://github.com/Delavalom/monoripify/issues)

## How to contribute

I would love to be your first PR! or any PR for that matter.

## License

Distributed under the MIT License. See [LICENSE](/LICENSE) for more information.
