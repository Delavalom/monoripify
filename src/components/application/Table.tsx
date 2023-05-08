import { type FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Card, List, ListItem } from "@tremor/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { GitBranch, MoreVertical } from "lucide-react";
import type { MonorepoData } from "~/data";

type Props = {
  data: MonorepoData;
};

export const TableComponent: FC<Props> = ({ data }) => {
  const [value1, value2] = Object.getOwnPropertyNames(data);

  return (
    <section className="w-full">
      {/* tabs */}
      <Tabs defaultValue="apps" className="w-full">
        <TabsList className="border">
          <TabsTrigger value={value1 ?? ""}>{value1}</TabsTrigger>
          <TabsTrigger value={value2 ?? ""}>{value2}</TabsTrigger>
        </TabsList>
        <TabsContent value={value1 ?? ""} className="w-full">
          <Card className="w-full px-4 py-1 text-black">
            <List>
              {data.apps.map((app) => (
                <ListItem
                  key={app.name}
                  className="my-4 flex items-center justify-between"
                >
                  {/* img name, subtitle  */}
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/public/app-window.png" />
                      <AvatarFallback>{value1?.slice(0, 4)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <h2 className="font-bold">{app.name}</h2>
                      <h3 className="text-sm">{app.domain}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-sm font-bold">{app.commit}</h2>
                    <div className="flex items-center gap-2">
                      {/* app date goes here */}
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
        <TabsContent value={value2 ?? ""} className="w-full">
          <Card className="w-full px-4 py-1">
            <List>
              {data.packages.map((item) => (
                <ListItem key={item.name} className="my-4 flex justify-between">
                  {/* img name, subtitle  */}
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/public/box.png" />
                      <AvatarFallback>{value2?.slice(0, 4)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h2 className="font-bold">{item.name}</h2>
                      <h3 className="text-sm">{item.moduleName}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-sm font-bold">{item.commit}</h2>
                    <div className="flex items-center gap-2">
                      {/* app date goes here */}
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
  );
};
