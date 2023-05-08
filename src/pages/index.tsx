import {
  BookMarked,
  ExternalLink,
  FolderGit2,
  Github,
  Lock
} from "lucide-react";
import { Inter } from "next/font/google";
import { Analytics } from "~/components/application/Analytics";
import { TableComponent } from "~/components/application/Table";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { cities, monorepoData } from "~/data";

const inter = Inter({ subsets: ["latin"] });

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat("us").format(number).toString()}`;

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col ${inter.className}`}>
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
          <div>
            <Button variant="outline">
              View on github
              <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
            </Button>
          </div>
        </section>
      </header>
      <main className="mx-auto flex w-full max-w-[1000px] flex-col gap-10 p-10">
        <Analytics data={cities} valueFormatter={valueFormatter} />
        <TableComponent data={monorepoData} />
      </main>
    </main>
  );
}
