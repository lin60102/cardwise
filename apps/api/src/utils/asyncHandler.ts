import type { NextFunction, Request, Response } from "express";

export function asyncHandler<Req extends Request = Request>(
  handler: (req: Req, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req as Req, res, next)).catch(next);
  };
}
