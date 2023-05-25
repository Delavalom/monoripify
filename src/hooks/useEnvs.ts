import { useContext } from "react";
import { EnvContext, EnvDispatchContext } from "~/context/envs/dispatchContext";

export const useEnvs = () => {
  const envVars = useContext(EnvContext);
  const dispatch = useContext(EnvDispatchContext);
  
  return {
    envVars,
    dispatch,
  };
};
