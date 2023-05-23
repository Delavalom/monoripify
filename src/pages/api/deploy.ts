import type { NextApiRequest, NextApiResponse } from "next";

export type DeployResponse = {
  data: {
    projectCreate: {
      id: "3dbfa261-2d0a-46d0-8c71-eb9b2db9bdf1";
      name: "dusty-size";
    };
  };
};

export default async function handleDeploy(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as { token: string, fullRepoName: string };

  console.log(body);

  const response = await fetch("https://backboard.railway.app/graphql/v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${body.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query:
        `mutation createProject {\n\tprojectCreate(input: {repo: {branch: "main", fullRepoName: "${body.fullRepoName}"}, plugins: []}) {\n\t\tid,\n\t\tname,\n\t}\n}`,
      operationName: "createProject",
    }),
  });

  const data = (await response.json()) as DeployResponse

  console.log(data);

  return res.status(200).json({ message: "success", deployment: data });
}
