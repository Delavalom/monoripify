import { type Dispatch,  type SetStateAction, type FC, useContext } from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "../../ui/Command";
  import { Popover, PopoverContent, PopoverTrigger } from "../../ui/Popover";
  import { ScrollArea } from "../../ui/ScrollArea";
import { Button } from "~/components/ui/Button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { MyRepoContext } from "~/context/repository/context";

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    value: { name: string; fullName: string };
  setValue: Dispatch<
    SetStateAction<{
      name: string;
      fullName: string;
    }>
  >,
    repositories: Partial<CustomRepoSchema>[]
};

export const RepositoryList: FC<Props> = ({open, setOpen, value, setValue, repositories}) => {
  const { setRepository } = useContext(MyRepoContext);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? repositories.find((repo) => repo.name === value.name)?.name
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
              {repositories.map((repo) => (
                <CommandItem
                  className="cursor-pointer"
                  key={repo.url}
                  onSelect={(currentValue) => {
                    setValue({
                      name: currentValue === value.name ? "" : currentValue,
                      fullName: repo.full_name ?? "",
                    });
                    setRepository(repo);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.name === repo.name ? "opacity-100" : "opacity-0"
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
  );
};
