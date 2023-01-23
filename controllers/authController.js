const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const { generateToken } = require("../config/jwtToken");
const { COOKIE_NAME } = require("../utils/variables");
const { generateRefreshToken } = require("../config/refreshToken");

module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  const user = await User.findOne({ email }).exec();

  if (!user) return res.status(400).json({ message: "Email not registered" });

  // check password
  if (!(await user.didPasswordMatch(password)))
    return res.status(400).json({ message: "Error credentials" });

  if (user.blocked) return res.status(400).json({ message: "You are blocked" });

  const refreshToken = generateRefreshToken(user._id);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true }
  );

  res.cookie(COOKIE_NAME, refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3,
  });

  return res.status(200).json({
    _id: user?._id,
    firstname: user?.firstname,
    lastname: user?.lastname,
    email: user?.email,
    mobile: user?.mobile,
    token: generateToken(user._id),
  });
});

module.exports.handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.statusCode = 401;
    throw new Error("Unauthorized");
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        res.statusCode = 403;
        throw new Error("Forbidden");
      }

      const user = await User.findOne({ refreshToken })
        .select("-password")
        .lean()
        .exec();

      if (!user) {
        res.statusCode = 404;
        throw new Error("No user with this refresh Token");
      }

      const accessToken = generateToken(user._id);

      res.json({ accessToken });
    }
  );
});

module.exports.logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  try {
    await User.findOneAndUpdate(
      refreshToken,
      { refreshToken: "" },
      { new: true }
    );
  } catch (error) {
    throw new Error(error);
  }
  res.clearCookie("jwt", { httpOnly: true, secure: true });
  return res.json({ message: "Log Out" });
});
