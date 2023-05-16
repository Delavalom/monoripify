/* eslint-disable @typescript-eslint/require-await */
import type { NextApiRequest, NextApiResponse } from "next";

export default async function output(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  console.log(req.body);

  res.status(200).end("succeed");
}
