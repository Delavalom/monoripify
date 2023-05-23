import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { env } from "~/env.mjs";

export const client = new ApolloClient({
  uri: "https://backboard.railway.app/graphql/v2",
  cache: new InMemoryCache(),
  headers: {
    Autorization: env.RAILWAY_TOKEN ? `Bearer ${env.RAILWAY_TOKEN}` : "",
    "Content-Type": "application/json",
  },
});

export const CREATE_PROJECT = gql`
  mutation projectCreate {
    projectCreate(
      input: {
        defaultEnvironmentName: "production"
        isPublic: true
        repo: { branch: "main", fullRepoName: "Delavalom/7-labs" }
        plugins: []
      }
    ) {
      id
      createdAt
      name
    }
  }
`;
