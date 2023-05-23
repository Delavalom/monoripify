import { type ReactNode, type FC } from "react";
import { Navbar } from "./Navbar";

type Props = {
  children: ReactNode;
  onClick?: () => void;
};

export const RootLayout: FC<Props> = ({ children, onClick }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar onClick={onClick} />
      {children}
    </main>
  );
};
