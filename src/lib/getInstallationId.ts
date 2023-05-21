import type { NextApiResponse } from "next";
import { type GetTokenParams, getToken } from "next-auth/jwt";
import { octokitApp } from "~/server/octokit";

export async function getInstallationId(req: GetTokenParams<false>["req"], res: NextApiResponse) {
    const token = await getToken({ req });

    if (!token) {
      res.status(402).json({ message: "unathorized" });
      return -1
    }
  
    const installationDetails = await octokitApp.octokit.request(
      "GET /users/{username}/installation",
      {
        username: token?.username,
      }
    );

    return installationDetails.data.id
}