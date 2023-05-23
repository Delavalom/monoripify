/* eslint-disable @typescript-eslint/require-await */
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstallationId } from "~/lib/getInstallationId";
import { octokitApp } from "~/server/octokit";

export default async function output(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  const installationId = await getInstallationId(req, res)

  const isInitialBuild = req.headers["x-initial-build"];

  if (isInitialBuild === "true") {
    try {
      await handleInitialBuild(req.body as SubmitData, installationId);
      return res.status(200).json({ message: "succeed" });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      return res.status(400).json({ message: "failed" });
    }
  }

  res.status(400).end("is not initial build");
}

async function handleInitialBuild(payload: SubmitData, installationId: number) {
  const octokit = await octokitApp.getInstallationOctokit(installationId);

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
        installation_id: installationId.toString(),
        repo_fullname: payload.repoFullname,
        envs,
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
}
