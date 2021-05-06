import { VercelApiHandler, VercelRequest, VercelResponse } from "@vercel/node";

function allowCors(fn: VercelApiHandler): VercelApiHandler {
  return async function (req: VercelRequest, res: VercelResponse) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return fn(req, res);
  };
}

export default allowCors;
