import { GetServerSidePropsContext, type NextPage } from "next";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import { useMutation } from "react-query";
import { BuildForm } from "~/components/application/BuildForm";
import { envsReducer } from "~/context/envs/dispatch";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";
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
      onSuccess() {
        setIsBuilding(true);
      },
    }
  );

  return (
    <EnvContext.Provider value={envVars}>
      <EnvDispatchContext.Provider value={dispatch}>
        <section className="mt-10 flex h-full w-full flex-col items-center justify-center">
          <BuildForm
            isLoading={isLoading}
            mutate={mutate}
            setValue={setValue}
            value={value}
            user={user}
          />
        </section>
      </EnvDispatchContext.Provider>
    </EnvContext.Provider>
  );
};

export default Installation;
