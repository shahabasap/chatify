// middleware/ErrorHandler.ts
import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error]: ${err.message || "Unknown error"}`);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: message,
    details: err.details || null,
  });
};
