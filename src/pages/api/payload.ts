/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { octokitApp } from "~/server/octokit";
import type { PushEvent } from "~/types/types";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const event = req.headers["x-github-event"];

  if (event === "push") {
    try {
      const body = req.body as PushEvent;
      const branchName = body.ref.split("/").pop() as string;
      console.log(
        `Received push event for repo ${body.repository.name} and branch ${branchName}`
      );

      await handlePushEvent(body);
      return res.status(200).json({ message: "succeed" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return res.status(400).json({ message: "failed" });
    }
  }

  return res.status(500).json({ message: "server error" });
}



async function handlePushEvent(payload: PushEvent) {
  const octokit = await octokitApp.getInstallationOctokit(
    payload.installation.id
  );

  await octokit.request(
    "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    {
      owner: "Delavalom",
      repo: "monoripify",
      workflow_id: "build.yml",
      ref: "main",
      inputs: {
        installation_id: payload.installation.id,
        repo_fullname: payload.repository.full_name,
        envs: "",
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
}
