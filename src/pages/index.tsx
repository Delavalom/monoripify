import {
  BookMarked,
  ExternalLink,
  FolderGit2,
  Github,
  Lock,
} from "lucide-react";
import { Inter } from "next/font/google";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-2 ${inter.className}`}
    >
      <header className="flex h-fit w-full items-center justify-between border-b-2 p-4">
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
        <div>
          <Button variant="outline">
            View on github
            <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
          </Button>
        </div>
      </header>
      <main>
        <section>{/* build analitycs */}</section>
        <section>
          {/* tabs */}
          <div></div>
          <section>
            {/* packages and apps table */}
            <div>
              <div>
                {/* img name, subtitle  */}
                <img src="" alt="" />
                <div>
                  <h1>acme</h1>
                  <h2>docs</h2>
                </div>
              </div>
              <div>
                {/* las commit  */}
                <div>
                  <h2>commit name</h2>
                  <h2>5m ago from</h2>
                </div>
              </div>
              <div>{/* 3 dots config  */}</div>
            </div>
          </section>
        </section>
      </main>
    </main>
  );
}
