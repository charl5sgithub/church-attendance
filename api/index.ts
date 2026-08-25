import app from "../server/src/app";

export default function handler(req: any, res: any) {
  // Guarantee CORS headers on every Vercel serverless invocation
  const origin = req.headers?.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle browser preflight requests immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return app(req, res);
}
