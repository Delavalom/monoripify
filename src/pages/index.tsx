import { Card, List, ListItem } from "@tremor/react";
import {
  BookMarked,
  Box,
  ExternalLink,
  FolderGit2,
  GitBranch,
  Github,
  Lock,
  MoreVertical,
} from "lucide-react";
import { Inter } from "next/font/google";
import { Analytics } from "~/components/application/Analytics";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/Tabs";
import { cities } from "~/data";

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
      <main className="mx-auto flex w-full max-w-[1000px] flex-col p-10 gap-10">
        <Analytics data={cities} valueFormatter={valueFormatter} />
        <section className="w-full">
          {/* tabs */}
          <Tabs defaultValue="apps" className="w-full">
            <TabsList className="border">
              <TabsTrigger value="apps">Apps</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
            </TabsList>
            <TabsContent value="apps" className="w-full">
              <Card className="w-full px-4 py-1 text-black">
                <List>
                  {["a", "b", "c", "d", "e"].map((item) => (
                    <ListItem
                      key={item}
                      className="my-4 flex items-center justify-between"
                    >
                      {/* img name, subtitle  */}
                      <div className="flex items-center gap-4">
                        <Github className="h-8 w-8 rounded-full border p-6" />
                        <div className="flex flex-col">
                          <h2 className="font-bold">Monoripify</h2>
                          <h3 className="text-sm">monoripify.io</h3>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-sm font-bold">
                          Launch new landing page
                        </h2>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs">5m ago from main</h3>
                          <GitBranch className="h-3 w-3" />
                        </div>
                      </div>
                      <MoreVertical className="h-6 w-6" />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </TabsContent>
            <TabsContent value="packages" className="w-full">
              <Card className="w-full px-4 py-1">
                <List>
                  {["a", "b", "c", "d", "e"].map((item) => (
                    <ListItem
                      key={item}
                      className="my-4 flex justify-between"
                    >
                      {/* img name, subtitle  */}
                      <div className="flex items-center gap-4">
                        <Box className="h-8 w-8 rounded-full border p-6" />
                        <div className="flex flex-col">
                          <h2 className="font-bold">shared-utils</h2>
                          <h3 className="text-sm">@share-utils</h3>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-sm font-bold">
                          Launch new package
                        </h2>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs">2m ago from main</h3>
                          <GitBranch className="h-3 w-3" />
                        </div>
                      </div>
                      <MoreVertical className="h-6 w-6" />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </main>
  );
}
