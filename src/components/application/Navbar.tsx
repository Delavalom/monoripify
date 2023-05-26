/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { ExternalLink, Github, Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useContext, useState, type FC, type ReactNode } from "react";
import Link from "next/link";
import { useMutation } from "react-query";
import { MyRepoContext } from "~/context/repository/context";
import { useToast } from "~/hooks/useToast";
import type { DeployResponse } from "~/pages/api/deploy";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { ToastAction } from "../ui/Toast";

type Props = {
  showDeploy?: boolean;
};

export const Navbar: FC<Props> = ({ showDeploy }) => {
  const [token, setToken] = useState("");
  const [projectId, setProjectId] = useState("");
  const { repository } = useContext(MyRepoContext);
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: (variables: { token: string; fullRepoName: string }) =>
      fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: variables.token,
          fullRepoName: variables.fullRepoName,
        }),
      })
        .then(
          (res) =>
            res.json() as Promise<{
              message: string;
              deployment: DeployResponse;
            }>
        )
        .then((d) => d),

    onSuccess(response) {
      if (!response.deployment) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return
      }
      const id = response.deployment.data.projectCreate.id;
      setProjectId(id);
      toast({
        title: "This is your project Id",
        description: id,
        action: (
          <Button asChild>
            <a href={`https://railway.app/project/${id}`}>
              Link to the project
            </a>
          </Button>
        ),
      });
    },
  });

  return (
    <header className="h-fit w-full border-b-2 p-4">
      <section className="mx-auto flex max-w-[1200px] items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {/* name and logo */}
            <Github className="h-6 w-6" />
            <h1 className="text-2xl font-medium">Monoripify</h1>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {showDeploy && (
            <>
              {projectId !== "" ? (
                <Button asChild variant="outline">
                  <a
                    href={`https://railway.app/project/${projectId}`}
                    target="_blank"
                  >
                    Deployment Link
                    <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
                  </a>
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      Deploy on Railway
                      <RailwayLogo className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <DeployContent token={token} setToken={setToken}>
                      <DeployButton
                        isLoading={isLoading}
                        onClick={() => {
                          if (repository?.full_name) {
                            mutate({
                              token,
                              fullRepoName: repository.full_name,
                            });
                          }
                        }}
                      />
                    </DeployContent>
                  </PopoverContent>
                </Popover>
              )}
            </>
          )}
          <Button asChild variant="outline">
            {repository?.html_url && (
              <Link href={`${repository?.html_url}`} target="_blank">
                View on github
                <ExternalLink className="ml-2 h-4 w-4 opacity-70 hover:scale-125" />
              </Link>
            )}
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut />
          </Button>
        </div>
      </section>
    </header>
  );
};

export const RailwayLogo = ({ className }: { className: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.756 438.175A520.713 520.713 0 0 0 0 489.735h777.799c-2.716-5.306-6.365-10.09-10.045-14.772-132.97-171.791-204.498-156.896-306.819-161.26-34.114-1.403-57.249-1.967-193.037-1.967-72.677 0-151.688.185-228.628.39-9.96 26.884-19.566 52.942-24.243 74.14h398.571v51.909H4.756ZM783.93 541.696H.399c.82 13.851 2.112 27.517 3.978 40.999h723.39c32.248 0 50.299-18.297 56.162-40.999ZM45.017 724.306S164.941 1018.77 511.46 1024c207.112 0 385.071-123.006 465.907-299.694H45.017Z"
        fill="#100F13"
      />
      <path
        d="M511.454 0C319.953 0 153.311 105.16 65.31 260.612c68.771-.144 202.704-.226 202.704-.226h.031v-.051c158.309 0 164.193.707 195.118 1.998l19.149.706c66.7 2.224 148.683 9.384 213.19 58.19 35.015 26.471 85.571 84.896 115.708 126.52 27.861 38.499 35.876 82.756 16.933 125.158-17.436 38.97-54.952 62.215-100.383 62.215H16.69s4.233 17.944 10.58 37.751h970.632A510.385 510.385 0 0 0 1024 512.218C1024.01 229.355 794.532 0 511.454 0Z"
        fill="#100F13"
      />
    </svg>
  );
};

type DeployButtonProps = {
  isLoading: boolean;
  onClick: () => void;
};

const DeployButton: FC<DeployButtonProps> = ({ isLoading, onClick }) => {
  return (
    <>
      {isLoading ? (
        <Button className="w-full" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </Button>
      ) : (
        <Button className="w-full" onClick={onClick}>
          Deploy
        </Button>
      )}
    </>
  );
};

type DeployContentProps = {
  token: string;
  setToken: (token: string) => void;
  children: ReactNode;
};

const DeployContent: FC<DeployContentProps> = ({
  token,
  setToken,
  children,
}) => {
  const [hasToken, setHasToken] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Railway Token</h4>
        <p className="text-sm text-muted-foreground">
          {hasToken
            ? "Token saved in state"
            : "Set your Railway token to deploy your repository."}
        </p>
      </div>
      {/*  */}
      <div className="grid gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="flex w-full items-center gap-4">
            {hasToken ? (
              <>
                <Button variant="secondary" onClick={() => setHasToken(false)}>
                  Discard
                </Button>
                {children}
              </>
            ) : (
              <>
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="h-8 w-full flex-1"
                />
                <Button onClick={() => setHasToken(true)}>Save</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
