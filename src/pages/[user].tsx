/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useEffect, useReducer, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { BuildForm } from "~/components/application/BuildForm";
import { Counter } from "~/components/application/Counter";
import { RootLayout } from "~/components/application/RootLayout";
import { envsReducer } from "~/context/envs/dispatch";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";
import { RepositoryProvider } from "~/context/repository/context";
import { fetchRepositories } from "~/lib/fetchRepositories";
import response from "../../openai-response-example.json";
import Pusher from "pusher";


const { efficiency_score, insights } = response as BuildProcessAnalysis; // placerholde data

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
      console.log("building")

    
  }, [isBuilding]);

  return (
    <RepositoryProvider>
      <RootLayout showDeploy={true}>
        <EnvContext.Provider value={envVars}>
          <EnvDispatchContext.Provider value={dispatch}>
            <section className="mx-auto mb-10 mt-10 flex h-full w-full max-w-[1000px] flex-col items-center justify-center">
              {isBuilding ? (
                <section className="bg-dots h-fit w-full rounded-lg border px-8 pb-8 pt-10">
                  <Counter />
                  {/* <Analytics
                  efficiency_score={efficiency_score}
                  insights={insights}
                /> */}
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
