import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import { env } from "~/env.mjs";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string
    };
    accessToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    accessToken: string
    installationId?: string 
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    jwt({ token, user, account }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
    }),
  ],
  events: {
    signIn(message) {
      console.log("Sign In", message);
    },
    signOut(message) {
      console.log("Sign Out", message);
    },
    session(message) {
      console.log("Session", message);
    },
    linkAccount(message) {
      console.log("Link Account", message);
    },
    createUser(message) {
      console.log("Create User", message);
    },
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
