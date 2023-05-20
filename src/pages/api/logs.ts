import { NextApiRequest, NextApiResponse } from "next";

export default function handleLogs(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)

    res.status(200).json({message: "succeed"})
}