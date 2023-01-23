const mongoose = require("mongoose");

const checkValidMongoId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports.isValidMongoId = (id) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid user ID");
};

module.exports.isValidProductId = (id) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid Product ID");
};
