import { NextApiRequest, NextApiResponse } from "next";
import { generate } from "~/server/openai";

type RequestBody = {
  build_id: number;
  status: string;
  logs: string;
};

type Response =
  | {
      message: "success";
      content: { buildId: number; logs: BuildProcessAnalysis };
    }
  | {
      message: "error";
      content: string;
    };

export default async function handleLogs(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const buildOutput = req.body as RequestBody;

  const analysis = await generate(buildOutput.logs);

  if (analysis.message === "error") {
    return res
      .status(404)
      .json(analysis as { message: "error"; content: string });
  }
  const output = JSON.parse(analysis.message) as BuildProcessAnalysis;

  return res.status(200).json({
    message: "success",
    content: { buildId: buildOutput.build_id, logs: output },
  });
}
