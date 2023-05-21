import {
  useState,
  type FC,
  MouseEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import { useRouter } from "next/router";
import { ChevronsUpDown, Trash } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/Command";
import { ScrollArea } from "../ui/ScrollArea";
import { Check } from "lucide-react";
import { Input } from "../ui/Input";
import { Plus } from "lucide-react";
import { Checkbox } from "../ui/Checkbox";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { UseMutateFunction } from "react-query";

type Props = {
  user: Schema | null;
  value: { name: string; fullName: string };
  setValue: Dispatch<
    SetStateAction<{
      name: string;
      fullName: string;
    }>
  >;
  isLoading: boolean;
  envVars: Required<Schema>["envs"];
  handleAddEnv: (e: MouseEvent<HTMLButtonElement>) => void;
  handleUpdateEnv: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  handleDeleteEnv: (e: MouseEvent<SVGElement>, id: string) => void;
  mutate: UseMutateFunction<Response, unknown, void, unknown>;
};

export const BuildForm: FC<Props> = ({
  user,
  value,
  setValue,
  isLoading,
  envVars,
  handleAddEnv,
  handleUpdateEnv,
  handleDeleteEnv,
  mutate,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
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
              <Label htmlFor="name">User ID {router.query.user}</Label>
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
                      ? user?.repositories.find(
                          (repo) => repo.name === value.name
                        )?.name
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
                              setValue({
                                name:
                                  currentValue === value.name
                                    ? ""
                                    : currentValue,
                                fullName: repo.full_name!,
                              });
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value.name === repo.name
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
        {isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full" onClick={() => mutate()}>
            Build
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
