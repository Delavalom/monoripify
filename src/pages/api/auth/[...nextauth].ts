import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { env } from "~/env.mjs"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)