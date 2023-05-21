import { generateId } from "~/lib/base58";

type Action =
  | {
      type: "add";
    }
  | {
      type: "update";
      payload: {
        id: string;
        key?: string;
        value?: string;
      };
    }
  | {
      type: "delete";
      payload: {
        id: string;
      };
    };

export function envsReducer(
  envs: Required<Schema>["envs"],
  action: Action
): Required<Schema>["envs"] {
  switch (action.type) {
    case "add": {
      return [
        ...envs,
        {
          id: generateId(),
          key: "",
          value: "",
        },
      ];
    }
    case "update": {
      return envs.map((env) => {
        if (env.id === action.payload.id) {
          return {
            ...env,
            ...action.payload
          };
        }
        return env;
      });
    }
    case "delete": {
      return envs.filter((v) => v.id !== action.payload.id);
    }
    default: {
      throw new Error("no action take it");
    }
  }
}
