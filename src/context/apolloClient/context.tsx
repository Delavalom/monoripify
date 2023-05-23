/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
import { ApolloProvider } from "@apollo/client";
import { type ReactNode, createContext, useState } from "react";
import { apolloClient } from "~/lib/createProject";

type Client = typeof apolloClient;

type ClientContext = {
  setClient: (client: Client) => void;
};

export const ApolloClientContext = createContext<ClientContext>({
  setClient: () => {},
});

export const ApolloClientProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState(apolloClient);

  return (
    <ApolloClientContext.Provider value={{ setClient }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ApolloClientContext.Provider>
  );
};
