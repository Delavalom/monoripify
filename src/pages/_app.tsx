import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (

      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <main className={`h-full w-full ${inter.className}`}>
            <Component {...pageProps} />
          </main>
        </SessionProvider>
      </QueryClientProvider>

  );
}
