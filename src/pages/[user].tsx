import { Check, ChevronsUpDown, Loader2, Plus, Trash } from "lucide-react";
import { GetServerSidePropsContext, type NextPage } from "next";
import { useRouter } from "next/router";
import { ChangeEvent, MouseEvent, useReducer, useState } from "react";
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
import { envsReducer } from "~/context/envs/dispatch";
import { generateId } from "~/lib/base58";
import { cn } from "~/lib/utils";
import { redis } from "~/server/redis";

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

const Installation: NextPage<{ user: Schema | null }> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    name: "",
    fullName: "",
  });
  const router = useRouter();
  const [envVars, dispatch] = useReducer(envsReducer, user?.envs ?? []);
  const [isBuilding, setIsBuilding] = useState(false);

  const { mutate, isLoading } = useMutation(
    () => {
      return fetch("/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-initial-build": "true",
        },
        body: JSON.stringify({
          installationId: router.query.user,
          repoFullname: value.fullName,
          envs: envVars,
        } as SubmitData),
      });
    },
    {
      onSuccess() {},
    }
  );

  const handleAddEnv = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "add" });
  };

  const handleDeleteEnv = (e: MouseEvent<SVGElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "delete", payload: { id } });
  };

  const handleUpdateEnv = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({
      type: "update",
      payload: { id, [e.target.name as "key" | "value"]: e.target.value },
    });
  };

  return (
    <section className="mt-10 flex h-full w-full flex-col items-center justify-center"></section>
  );
};

export default Installation;
