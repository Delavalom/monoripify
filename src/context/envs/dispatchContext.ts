import { Dispatch, createContext } from "react";
import { Action } from "./dispatch";

export const EnvContext = createContext<Required<Schema>["envs"] | null>(null)
export const EnvDispatchContext = createContext<Dispatch<Action> | null>(null)