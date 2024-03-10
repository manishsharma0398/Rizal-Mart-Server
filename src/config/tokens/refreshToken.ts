import jwt from "jsonwebtoken";

import { ENV_VARS } from "@utils";

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, ENV_VARS.REFRESH_TOKEN, {
    expiresIn: "3d",
    // algorithm: "RS256",
  });
};
