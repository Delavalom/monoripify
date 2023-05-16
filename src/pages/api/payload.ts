/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  const event = req.headers["x-github-event"];
  try {
    if (event === "push") {
      const body = req.body as PushEvent;
      const branchName = body.ref.split("/").pop() as string;
      console.log(
        `Received push event for repo ${body.repository.name} and branch ${branchName}`
      );

      const octokit = await octokitApp.getInstallationOctokit(
        body.installation.id
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
      return res.status(200).json({ message: "succeed" });
    }
    return res.status(400).json({ message: "failed" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    console.log(error)
    return res.status(500).json({ message: "server error" })
  }
}
