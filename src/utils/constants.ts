export const ENV_VARS = {
  PORT: process.env.PORT,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASS: process.env.MONGO_PASS,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  JWT_SECRET: process.env.JWT_SECRET as string,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN as string,
  EMAIL_ID: process.env.EMAIL_ID,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  MONGO_URL: process.env.MONGO_URL,
};

export const LOG_FILES = {
  USER_BLOCKED_LOG_FILE: "userBlockedLog.log",
  USER_UNBLOCKED_LOG_FILE: "userUnBlockedLog.log",
  PWD_LOG_FILE: "password.log",
};

export const COOKIE_NAME = "jwt";