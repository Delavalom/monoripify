import type { NextApiRequest, NextApiResponse } from "next";

export default function output(req: NextApiRequest, res: NextApiResponse<void>) {
    console.log(req.body)
    console.log("succeed")
    res.status(200)
}