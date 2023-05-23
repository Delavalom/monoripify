/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Pusher from "pusher-js";
import { useEffect, useReducer, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Analytics } from "~/components/application/Analytics";
import { BuildForm } from "~/components/application/BuildForm";
import { Counter } from "~/components/application/Counter";
import { RootLayout } from "~/components/application/RootLayout";
import { envsReducer } from "~/context/envs/dispatch";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";
import { RepositoryProvider } from "~/context/repository/context";
import { fetchRepositories } from "~/lib/fetchRepositories";

const Installation: NextPage = () => {
  const [value, setValue] = useState({
    name: "",
    fullName: "",
  });
  const [envVars, dispatch] = useReducer(envsReducer, []);
  const [isBuilding, setIsBuilding] = useState(false);
  const { data: repositories } = useQuery({
    queryKey: ["repositories"],
    queryFn: () => fetchRepositories(),
  });
  const [data, setData] = useState<{
    buildId: number;
    logs: BuildProcessAnalysis;
  } | null>(null);

  const { mutate, isLoading } = useMutation(
    () =>
      fetch("/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-initial-build": "true",
        },
        body: JSON.stringify({
          repoFullname: value.fullName,
          envs: envVars,
        } as SubmitData),
      }),
    {
      onSuccess() {
        setIsBuilding(true);
      },
    }
  );

  useEffect(() => {
    const pusher = new Pusher("8480959283852d2d55a4", {
      cluster: "us2",
    });

    console.log("Pusher.Connection.State", pusher.connection.state);

    const channel = pusher.subscribe("logs");

    channel.bind(
      "logs-output",
      (data: { buildId: number; logs: BuildProcessAnalysis }) => {
        setData(data);
      }
    );

    return () => pusher.disconnect();
  }, [isBuilding]);

  return (
    <RepositoryProvider>
      <RootLayout showDeploy={true}>
        <EnvContext.Provider value={envVars}>
          <EnvDispatchContext.Provider value={dispatch}>
            <section className="mx-auto mb-10 mt-10 flex h-full w-full max-w-[1000px] flex-col items-center justify-center">
              {isBuilding ? (
                <section className="bg-dots h-fit w-full rounded-lg border px-8 pb-8 pt-10">
                  {data ? (
                    <Analytics
                      efficiency_score={data.logs.efficiency_score}
                      insights={data.logs.insights}
                    />
                  ) : (
                    <Counter />
                  )}
                </section>
              ) : (
                <BuildForm
                  isLoading={isLoading}
                  mutate={mutate}
                  setValue={setValue}
                  value={value}
                  repositories={repositories?.data}
                />
              )}
            </section>
          </EnvDispatchContext.Provider>
        </EnvContext.Provider>
      </RootLayout>
    </RepositoryProvider>
  );
};

export default Installation;
