import { type ReactNode, type FC } from "react";
import { Navbar } from "../ui/Navbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: ReactNode;
  onClick?: () => void
};

export const RootLayout: FC<Props> = ({ children, onClick }) => {
  return (
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
      <Navbar onClick={onClick} />
      {children}
    </main>
  );
};
