import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";
import { GetServerSidePropsContext, type NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useMutation } from "react-query";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Checkbox } from "~/components/ui/Checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/Command";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/Popover";
import { ScrollArea } from "~/components/ui/ScrollArea";
import { generateId } from "~/lib/base58";
import { cn } from "~/lib/utils";
import { redis } from "~/server/redis";

const repositories = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const installationId = ctx.query.user;

  if (typeof installationId !== "string") return { props: {} };

  const user = await redis.get<Schema>(installationId);

  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=100, stale-while-revalidate=59"
  );

  return {
    props: { user },
  };
}

type SubmitData = {
  installationId: string;
  repository: string;
  envs: {
    id: string;
    key: string;
    value: string;
  }[];
};

const Installation: NextPage<{ user: Schema | null }> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [envVars, setEnvVars] = useState<Required<Schema>["envs"]>(
    user?.envs ?? []
  );
  const router = useRouter();

  const { mutate } = useMutation(() => {
    return fetch("/api/build", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-initial-build": "true"
      },
      body: JSON.stringify({
        installationId: router.query.user,
        repository: value,
        envs: envVars
      })
    })
  })

  const handleAddEnv = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setEnvVars((vars) => {
      return [
        ...vars,
        {
          id: generateId(),
          key: "",
          value: "",
        },
      ];
    });
  };

  const handleDeleteEnv = (e: MouseEvent<SVGElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    const envList = envVars.filter((v) => v.id !== id);
    setEnvVars(envList);
  };

  const handleUpdateEnv = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    const envList = envVars.map((v) => {
      if (id === v.id) {
        if (e.currentTarget.name === "key") {
          return {
            ...v,
            key: e.currentTarget.value,
          };
        }
        return {
          ...v,
          value: e.currentTarget.value,
        };
      }
      return v;
    });
    setEnvVars(envList);
  };

  return (
    <section className="mt-10 flex h-full w-full flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Build process</CardTitle>
          <CardDescription>
            Build your project and see logs analytics in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">
                  User ID {router.query.user}
                </Label>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Repositories</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between"
                    >
                      {value
                        ? user?.repositories.find((repo) => repo.name === value)
                            ?.name
                        : "Select repo..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search repo..." />
                      <CommandEmpty>No repo found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-80">
                          {user?.repositories.map((repo) => (
                            <CommandItem
                              className="cursor-pointer"
                              key={repo.url}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === repo.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {repo.name}
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="envs">Environment Variables</Label>
                <ul className="flex flex-col gap-2">
                  {envVars.map((env) => (
                    <li className="flex items-center gap-2" key={env.id}>
                      <Input
                        name="key"
                        placeholder="KEY..."
                        value={env.key}
                        onChange={(e) => handleUpdateEnv(e, env.id)}
                      />
                      <Input
                        name="value"
                        placeholder="value..."
                        type="password"
                        value={env.value}
                        onChange={(e) => handleUpdateEnv(e, env.id)}
                      />
                      <Trash
                        className="h-8 w-8 cursor-pointer"
                        onClick={(event) => handleDeleteEnv(event, env.id)}
                      />
                    </li>
                  ))}
                  <Button
                    className="w-fit rounded-full p-2"
                    variant="outline"
                    onClick={(e) => handleAddEnv(e)}
                  >
                    <Plus />
                  </Button>
                </ul>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" className="h-4 w-4" />
                <Label htmlFor="terms" className="text-sm opacity-60">
                  Accept terms and conditions
                </Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="submit"
            className="w-full"
            onClick={() => mutate()}
          >
            Build
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default Installation;
