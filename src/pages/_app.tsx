import { ApolloProvider } from "@apollo/client";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { client } from "~/lib/apolloClient";
import "~/styles/globals.css";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ApolloProvider client={client}>

    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
    </ApolloProvider>
  );
}
