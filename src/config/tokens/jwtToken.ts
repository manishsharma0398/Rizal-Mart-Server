import { sign } from "jsonwebtoken";

import { ENV_VARS } from "@utils";

export const generateToken = (id: string) => {
  return sign({ id }, ENV_VARS.JWT_SECRET, {
    expiresIn: "1d",
    // algorithm: "RS256",
  });
};
