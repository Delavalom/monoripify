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

  const octokit = await octokitApp.getInstallationOctokit(
    parseInt(querys.installation_id, 10)
  );

  const accessibleRepos = await octokit.request(
    "GET /installation/repositories",
    {
      per_page: 100,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const sortedRepos: Partial<CustomRepoSchema>[] =
    accessibleRepos.data.repositories
      .sort((a, b) => {
        if (a.pushed_at && b.pushed_at) {
          const aDate = new Date(a.pushed_at);
          const bDate = new Date(b.pushed_at);

          if (bDate > aDate) {
            return 1;
          }
          if (aDate > bDate) {
            return -1;
          }
        }
        return 0;
      })
      .map((repo) => {
        return {
          id: repo.id,
          node_id: repo.node_id,
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          url: repo.url,
          private: repo.private,
          default_branch: repo.default_branch,
          open_issues: repo.open_issues,
          owner: {
            login: repo.owner.login,
            id: repo.owner.id,
            node_id: repo.owner.node_id,
            avatar_url: repo.owner.avatar_url,
            url: repo.owner.url,
            html_url: repo.owner.html_url
          },
          permissions: repo.permissions,
        };
      });

  sortedRepos.splice(29);

  await redis.set<Schema>(querys.installation_id, {
    repositories: sortedRepos,
  });

  res.redirect(`/${querys.installation_id}`);
}
