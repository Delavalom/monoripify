import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { RootLayout } from "~/components/application/RootLayout";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <RootLayout>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </RootLayout>
  );
}
