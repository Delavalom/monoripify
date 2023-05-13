import { App } from "octokit";
import { env } from "~/env.mjs";

export const octokitApp = new App({
  appId: env.APP_ID,
  privateKey: env.APP_SECRET,
  webhooks: { secret: env.WEBHOOK_SECRET_TOKEN },
});