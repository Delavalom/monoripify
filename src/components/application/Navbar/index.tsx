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
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/Popover";
import { ToastAction } from "../../ui/Toast";
import { RailwayLogo } from "./RailwayLogo";
import { DeployContent } from "./DeployContent";
import { DeployButton } from "./DeployButton";

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

