import { Plus, Trash } from "lucide-react";
import { type FC } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import { useEnvs } from "~/hooks/useEnvs";


export const BuildList = () => {
  const { envVars, dispatch } = useEnvs();

  if (!dispatch) {
    return <></>;
  }

  const handleAddEnv = () => {
    dispatch({ type: "add" });
  };

  const handleDeleteEnv = (id: string) => {
    dispatch({ type: "delete", payload: { id } });
  };

  const handleUpdateEnv = (
    id: string,
    name: "key" | "value",
    value: string
  ) => {
    dispatch({
      type: "update",
      payload: { id, [name]: value },
    });
  };

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
          handleUpdateEnv(
            env.id,
            e.target.name as "key" | "value",
            e.target.value
          );
        }}
      />
      <Input
        name="value"
        placeholder="value..."
        type="password"
        value={env.value}
        onChange={(e) => {
          e.preventDefault();
          handleUpdateEnv(
            env.id,
            e.target.name as "key" | "value",
            e.target.value
          );
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
