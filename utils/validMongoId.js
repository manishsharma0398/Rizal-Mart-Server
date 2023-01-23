const mongoose = require("mongoose");

module.exports.isValidMongoId = (id) => {
  const validUserId = mongoose.Types.ObjectId.isValid(id);
  if (!validUserId) throw new Error("Invalid user ID");
};
