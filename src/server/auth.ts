import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import { env } from "~/env.mjs";
import GithubProvider from 'next-auth/providers/github'

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30
  },
  callbacks: {
    jwt({ token, user }) {
      if(token && user) {
        return {
          ...token,
          user
        }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      return session
    },

  },
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: env.CLIENT_SECRET,
      
    })
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
