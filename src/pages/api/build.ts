/* eslint-disable @typescript-eslint/require-await */
import type { NextApiRequest, NextApiResponse } from "next";
import { octokitApp } from "~/server/octokit";

export default async function output(
  req: NextApiRequest,
  res: NextApiResponse<{message: string}>
) {
  console.log(req.body);

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

  res.status(200).end("succeed");
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
