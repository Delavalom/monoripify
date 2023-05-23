import { type ReactNode, type FC } from "react";
import { Navbar } from "./Navbar";

type Props = {
  children: ReactNode;
  showDeploy?: boolean
};

export const RootLayout: FC<Props> = ({ children, showDeploy }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar showDeploy={showDeploy} />
      {children}
    </main>
  );
};
