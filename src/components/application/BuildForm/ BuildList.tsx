import { Plus, Trash } from "lucide-react";
import { type FC } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";

type Props = {
    handleUpdateEnv: (id: string, name: "key" | "value", value: string) => void;
    handleDeleteEnv: (id: string) => void;
    handleAddEnv(): void
    envVars: Required<Schema>["envs"] | null
};

export const BuildList: FC<Props> = ({handleUpdateEnv, handleDeleteEnv, handleAddEnv, envVars}) => {
  return (
    <div>
      <Label htmlFor="envs">Environment Variables</Label>
      <ul className="flex flex-col gap-2">
        {envVars?.map((env) => (
          <EnvVariableItem
            key={env.id}
            env={env}
            handleUpdateEnv={handleUpdateEnv}
            handleDeleteEnv={handleDeleteEnv}
          />
        ))}
        <Button
          className="w-fit rounded-full p-2"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            handleAddEnv();
          }}
        >
          <Plus />
        </Button>
      </ul>
    </div>
  );
};


type EnvVariableItemProps = {
    env: Required<Schema>["envs"][0];
    handleUpdateEnv: (id: string, name: "key" | "value", value: string) => void;
    handleDeleteEnv: (id: string) => void;
  };
  
  const EnvVariableItem: FC<EnvVariableItemProps> = ({
    env,
    handleUpdateEnv,
    handleDeleteEnv,
  }) => {
    return (
      <li className="flex items-center gap-2">
        <Input
          name="key"
          placeholder="KEY..."
          value={env.key}
          onChange={(e) => {
            e.preventDefault();
            handleUpdateEnv(env.id, e.target.name as "key" | "value", e.target.value);
          }}
        />
        <Input
          name="value"
          placeholder="value..."
          type="password"
          value={env.value}
          onChange={(e) => {
            e.preventDefault();
            handleUpdateEnv(env.id, e.target.name as "key" | "value", e.target.value);
          }}
        />
        <Trash
          className="h-8 w-8 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleDeleteEnv(env.id);
          }}
        />
      </li>
    );
  };
  
