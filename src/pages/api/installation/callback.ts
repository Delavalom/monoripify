import type { NextApiRequest, NextApiResponse } from "next";
import { octokitApp } from "~/server/octokit";
import { redis } from "~/server/redis";

type Query = {
  code: string;
  installation_id: string;
  setup_action: string;
};

export default async function installation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const querys = req.query as Query;

  const octokit = await octokitApp.getInstallationOctokit(parseInt(querys.installation_id, 10));

  const accessibleRepos = await octokit.request('GET /installation/repositories', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  await redis.set<Schema>(querys.installation_id, { repositories: accessibleRepos.data.repositories })

  res.redirect(`/${querys.installation_id}`);
}
