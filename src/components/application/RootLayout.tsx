import { type ReactNode, type FC } from "react";
import { Navbar } from "../ui/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
};

export const RootLayout: FC<Props> = ({ children }) => {
  return (
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 p-10">
        {children}

      </main>
    </main>
  );
};
