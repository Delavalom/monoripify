/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useReducer, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { BuildForm } from "~/components/application/BuildForm";
import { Counter } from "~/components/application/Counter";
import { envsReducer } from "~/context/envs/dispatch";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";
import { fetchRepositories } from "~/lib/fetchRepositories";
import response from "../../openai-response-example.json";
import { Analytics } from "~/components/application/Analytics";
import { CREATE_PROJECT } from "~/lib/createProject";
import { useMutation as useGqlMutation } from "@apollo/client";
import { RootLayout } from "~/components/application/RootLayout";
import { ApolloClientProvider } from "~/context/apolloClient/context";

const { efficiency_score, insights } = response as BuildProcessAnalysis;

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

  const [createProject, { data, loading, error }] = useGqlMutation<{
    id: string;
  }>(CREATE_PROJECT, {
    onCompleted(data) {
      console.log(data.id)
    }
  });

  const { mutate, isLoading } = useMutation(
    () => {
      return fetch("/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-initial-build": "true",
        },
        body: JSON.stringify({
          repoFullname: value.fullName,
          envs: envVars,
        } as SubmitData),
      });
    },
    {
      onSuccess() {
        setIsBuilding(true);
      },
    }
  );

  return (
    <ApolloClientProvider>
      <RootLayout onClick={() => createProject({})}>
        <EnvContext.Provider value={envVars}>
          <EnvDispatchContext.Provider value={dispatch}>
            <section className="mx-auto mb-10 mt-10 flex h-full w-full max-w-[1000px] flex-col items-center justify-center">
              {true ? (
                <section className="bg-dots h-fit w-full rounded-lg border px-8 pb-8 pt-10">
                  {/* <Counter /> */}
                  <Analytics
                    efficiency_score={efficiency_score}
                    insights={insights}
                  />
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
    </ApolloClientProvider>
  );
};

export default Installation;
