import { Request, Response, NextFunction } from "express";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = {
    success: false,
    statusCode: 404,
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  };

  return res.status(404).json(error);
};

export default notFound;