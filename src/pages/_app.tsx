import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { RootLayout } from "~/components/application/RootLayout";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </SessionProvider>
    </QueryClientProvider>
  );
}
