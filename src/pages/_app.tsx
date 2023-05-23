import { ApolloProvider } from "@apollo/client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { apolloClient } from "~/lib/createProject";
import "~/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <main className={`h-full w-full ${inter.className}`}>
            <Component {...pageProps} />
          </main>
        </SessionProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
