import jwt from "jsonwebtoken";

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: "3d",
    // algorithm: "RS256",
  });
};
