import type { NextApiRequest, NextApiResponse } from "next";

export default function installation(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const querys = req.query

    console.log(querys)

    res.redirect('/')
}
