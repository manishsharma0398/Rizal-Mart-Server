import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import { ENV_VARS } from "@utils";
import { findById } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      roles?: string;
    }
  }
}

export const verifyToken = asyncHandler(
  async (req: Request, res: Response, next) => {
    // TODO: make this accept only string
    const authHeader = req?.headers?.Authorization;

    if (
      !authHeader ||
      Array.isArray(authHeader) ||
      authHeader?.startsWith("Bearer ")
    ) {
      res.statusCode = 401;
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    verify(token, ENV_VARS.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const user = await findById((decoded as JwtPayload).id)
        .select("-password")
        .lean()
        .exec();
      req.userId = user!._id.toString();
      req.roles = user!.role;
      next();
    });
  }
);

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await findById(req.userId).lean().exec();

  if (user!.role !== "admin") {
    res.statusCode = 401;
    throw new Error("Unauthorized. You are not admin");
  } else {
    next();
  }
});
