import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import {
  useContext,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { type UseMutateFunction } from "react-query";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";
import { Button } from "../../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/Card";
import { Checkbox } from "../../ui/Checkbox";
import { Label } from "../../ui/Label";
import { BuildList } from "./ BuildList";
import { RepositoryList } from "./RepositoryList";

type Props = {
  repositories: Partial<CustomRepoSchema>[] | undefined;
  value: { name: string; fullName: string };
  setValue: Dispatch<
    SetStateAction<{
      name: string;
      fullName: string;
    }>
  >;
  isLoading: boolean;
  mutate: UseMutateFunction<Response, unknown, void, unknown>;
};

export const BuildForm: FC<Props> = ({
  repositories,
  value,
  setValue,
  isLoading,
  mutate,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const envVars = useContext(EnvContext);
  const dispatch = useContext(EnvDispatchContext);

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
              {typeof repositories === "undefined" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RepositoryList
                  open={open}
                  setOpen={setOpen}
                  value={value}
                  setValue={setValue}
                  repositories={repositories}
                />
              )}
            </div>
            <BuildList
              envVars={envVars}
              handleUpdateEnv={handleUpdateEnv}
              handleDeleteEnv={handleDeleteEnv}
              handleAddEnv={handleAddEnv}
            />
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
        <BuildButton isLoading={isLoading} onClick={() => mutate()} />
      </CardFooter>
    </Card>
  );
};

type BuildButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

const BuildButton: FC<BuildButtonProps> = ({ isLoading, onClick }) => {
  return (
    <>
      {isLoading ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" className="w-full" onClick={onClick}>
          Build
        </Button>
      )}
    </>
  );
};
