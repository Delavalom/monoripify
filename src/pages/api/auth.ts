import type { NextApiRequest, NextApiResponse } from "next"
import { octokitApp } from "~/server/octokit"


export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const data = await octokitApp.octokit.request("GET /app")

    res.json({ data })
}