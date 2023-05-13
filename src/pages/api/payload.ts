/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { octokitApp } from "~/server/octokit";
import { parse } from 'yaml'
import {resolve, join} from 'path'
import type { PushEvent } from "~/types/types";

type Data = {
  message: string;
};

const yamlPath = join(resolve(), ".github/worflows/build.yml")


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const event = req.headers["x-github-event"];
  if (event === "push") {
    const body = req.body as PushEvent
    const branchName = body.ref.split("/").pop() as string;
    console.log(
      `Received push event for repo ${body.repository.name} and branch ${branchName}`
      );
      
      const inputs = parse(yamlPath)
      
      console.group("input yaml")
      console.log(inputs)
      console.groupEnd()

    await octokitApp.octokit.request('POST /repos/Delavalom/my-porfolio-page/actions/workflows/build.yml/dispatches', {
      owner: 'Delavalom',
      repo: 'my-porfolio-page',
      workflow_id: 'build.yml',
      ref: 'main',
      inputs: parse(yamlPath),
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    res.status(200).json({ message: "succeed" });
  }
  res.status(400).json({ message: "failed" });
}
