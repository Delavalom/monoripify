import Pusher from "pusher";
import { env } from "~/env.mjs";

export const pusher = new Pusher({
  key: env.PUSHER_APP_KEY,
  appId: env.PUSHER_APP_ID,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.PUSHER_APP_CLUSTER,
})
