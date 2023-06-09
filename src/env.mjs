import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  //   DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string().min(1) : z.string().url()
  ),

  APP_ID: z.string().min(1),
  PRIVATE_KEY: z.string().min(1),
  WEBHOOK_SECRET_TOKEN: z.string().min(1),

  GITHUB_APP_CLIENT_SECRET: z.string().min(1),

  OPENAI_API_KEY: z.string().min(1),

  PUSHER_APP_ID: z.string().min(1),
  PUSHER_APP_KEY: z.string().min(1),
  PUSHER_APP_SECRET: z.string().min(1),
  PUSHER_APP_CLUSTER: z.string().min(1),

  LOGS_API_URL: z.string().min(1),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  //   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1)
  NEXT_PUBLIC_GITHUB_APP_CLIENT_ID: z.string().min(1),

  NEXT_PUBLIC_RAILWAY_TOKEN: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  //   DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,

  APP_ID: process.env.APP_ID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  WEBHOOK_SECRET_TOKEN: process.env.WEBHOOK_SECRET_TOKEN,

  NEXT_PUBLIC_GITHUB_APP_CLIENT_ID:
    process.env.NEXT_PUBLIC_GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  NEXT_PUBLIC_RAILWAY_TOKEN: process.env.NEXT_PUBLIC_RAILWAY_TOKEN,

  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
  PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
  PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,

  LOGS_API_URL: process.env.LOGS_API_URL
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type { MergedOutput } */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
