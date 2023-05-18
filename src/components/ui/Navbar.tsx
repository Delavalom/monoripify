import { BookMarked, ExternalLink, FolderGit2, Github, Lock, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { type FC } from "react";
import { Badge } from "./Badge";
import { Button } from "./Button";

export const Navbar: FC = () => {
  return (
    <header className="h-fit w-full border-b-2 p-4">
      <section className="mx-auto flex max-w-[1200px] items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* name and logo */}
            <Github className="h-6 w-6" />
            <h1 className="text-2xl font-medium">Monoripify</h1>
          </div>
          <nav>
            {/*  */}
            <ul className="flex items-center gap-2 text-sm font-medium">
              <div className="flex">
                <BookMarked className="mr-2 h-4 w-4" />
                <li>acme</li>
              </div>
              <div className="flex">
                <Lock className="mr-2 h-4 w-4" />
                <li>private</li>
              </div>
              <div className="flex">
                <FolderGit2 className="mr-2 h-4 w-4" />
                <li>main</li>
              </div>
              <Badge>Protected</Badge>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="outline">
            View on github
            <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut />
          </Button>
        </div>
      </section>
    </header>
  );
};
