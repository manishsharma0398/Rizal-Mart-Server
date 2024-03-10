const asyncHandler = require("express-async-handler");

const User = require("../models/User");
const { logEvents } = require("../middlewares/logger");
const { isValidMongoId } = require("../utils/validMongoId");

const {
  USER_BLOCKED_LOG_FILE,
  USER_UNBLOCKED_LOG_FILE,
} = require("../utils/variables");

module.exports.register = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    mobile,
    password,
    confirmPassword: password2,
  } = req.body;

  if (!firstname || !lastname || !email || !mobile || !password || !password2)
    return res.status(400).json({ message: "All fields required" });

  if (password !== password2)
    return res.status(400).json({ message: "Passwords do not match" });

  const user = await User.findOne({ email }).exec();

  if (user)
    return res.status(400).json({ message: "Email already registered" });

  const { confirmPassword, ...userdata } = req.body;

  await User.create(userdata);

  return res.status(201).json({ message: "User created" });
});

// Route only accessible to admin
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  try {
    const allUsers = await User.find().select("-password").lean();
    return res.json(allUsers);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  isValidMongoId(userId);

  try {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) return res.status(404).json({ message: "No user found" });
    return res.json(user);
  } catch (error) {
    throw new Error("Invalid User Id");
  }
});

module.exports.updateUser = asyncHandler(async (req, res) => {
  const userId = req.userId;
  isValidMongoId(userId);

  const updatedUserData = {
    firstname: req.body?.firstname,
    lastname: req.body?.lastname,
    email: req.body?.email,
    mobile: req.body?.mobile,
  };

  if (
    !updatedUserData.firstname ||
    !updatedUserData.lastname ||
    !updatedUserData.email ||
    !updatedUserData.mobile
  )
    return res.status(400).json({ message: "Required" });

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) return res.status(404).json({ message: "No user found" });

    return res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  isValidMongoId(userId);

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "No user found" });
    return res.json({ message: "User deleted" });
  } catch (error) {
    throw new Error("Invalid User Id");
  }
});

module.exports.blockUser = asyncHandler(async (req, res) => {
  const userToBlock = req.params?.userId;
  isValidMongoId(userToBlock);

  try {
    const user = await User.findByIdAndUpdate(
      userToBlock,
      { blocked: true },
      { new: true }
    ).exec();

    logEvents(`${user._id}: ${user.email}`, USER_BLOCKED_LOG_FILE);

    return res.json({ message: `User ${user._id} blocked` });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports.unBlockUser = asyncHandler(async (req, res) => {
  const userId = req.params?.userId;
  isValidMongoId(userId);

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { blocked: false },
      { new: true }
    ).exec();

    logEvents(`${user._id}: ${user.email}`, USER_UNBLOCKED_LOG_FILE);

    return res.json({ message: `User ${user._id} unblocked` });
  } catch (error) {
    throw new Error(error);
  }
});
