import { Request, Response } from "express";

import { logEvents } from "./logger";

export function errorHandler(err: Error, req: Request, res: Response) {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );

  const status = res.statusCode === 200 ? 500 : res.statusCode;
  console.log(err);
  res.status(status).json({ message: err?.message });
}
