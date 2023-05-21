import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

type Query = {
  code: string;
  installation_id: string;
  setup_action: string;
};

export default async function installation(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req });

  if (!token) {
    return res.redirect("/");
  }

  const querys = req.query as Query;

  token.installationId = querys.installation_id;

  console.log(token);

  res.redirect(`/${token.id}`);
}
