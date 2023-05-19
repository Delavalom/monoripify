/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { octokitApp } from "~/server/octokit";
import type { PushEvent } from "~/types/types";
import { env } from "~/env.mjs";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const isInitialBuild = req.headers["x-initial-build"];

  console.log(isInitialBuild);

  if (isInitialBuild === "true") {
    try {
      handleInitialBuild(req.body);
      return res.status(200).json({ message: "succeed" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return res.status(400).json({ message: "failed" });
    }
  }
  
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

async function handleInitialBuild(
  payload: Schema & { installationId: string; repoFullname: string }
) {
  const octokit = await octokitApp.getInstallationOctokit(
    parseInt(payload.installationId, 10)
  );

  let envs: string;

  if (payload.envs) {
    envs = Object.entries(payload.envs)
      .map((v) => {
        return v.join("=");
      })
      .join(" ");
  } else {
    envs = "";
  }

  await octokit.request(
    "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    {
      owner: "Delavalom",
      repo: "monoripify",
      workflow_id: "build.yml",
      ref: "main",
      inputs: {
        installation_id: payload.installationId,
        repo: payload.repoFullname,
        envs,
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
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
        app_id: env.APP_ID,
        webhook_secret_token: env.WEBHOOK_SECRET_TOKEN,
        private_key: env.PRIVATE_KEY,
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
}
