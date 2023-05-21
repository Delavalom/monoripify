import { GetServerSidePropsContext, type NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Analytics } from "~/components/application/Analytics";
import { BuildForm } from "~/components/application/BuildForm";
import { envsReducer } from "~/context/envs/dispatch";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";
import { fetchRepositories } from "~/lib/fetchRepositories";

const Installation: NextPage = () => {
  const [value, setValue] = useState({
    name: "",
    fullName: "",
  });
  const router = useRouter();
  const [envVars, dispatch] = useReducer(envsReducer, []);
  const [isBuilding, setIsBuilding] = useState(false);
  const { data: repositories } = useQuery({
    queryKey: ["repositories"],
    queryFn: () => fetchRepositories(),
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
    <EnvContext.Provider value={envVars}>
      <EnvDispatchContext.Provider value={dispatch}>
        <section className="mt-10 flex h-full w-full max-w-[1000px] mx-auto flex-col items-center justify-center">
        {isBuilding ? (
              <section className="bg-dots flex h-[200px] w-full items-center justify-center rounded-lg border">
                <Analytics data={[]} />
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
  );
};

export default Installation;
