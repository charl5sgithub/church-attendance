import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // eslint-disable-next-line no-console
  console.error("Express Error:", err);

  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");

  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: err?.message || "Internal server error" });
}
