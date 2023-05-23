export const createProject = async (token: string) => {
  const response = await fetch("https://backboard.railway.app/graphql/v2", {
    method: "POST",
    headers: {
      Autorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `mutation projectCreate {
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
        }`,
      operationName: "createProject"
    }),
  });

  const id = (await response.json()) as { id: string };

  return id;
};

