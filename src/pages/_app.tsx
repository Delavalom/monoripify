import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toast, ToastProvider } from "~/components/ui/Toast";
import "~/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <main className={`h-full w-full ${inter.className}`}>
            <Component {...pageProps} />
            <Toast />
          </main>
        </SessionProvider>
      </QueryClientProvider>
    </ToastProvider>
  );
}
