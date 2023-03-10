const mongoose = require("mongoose");

module.exports.checkValidMongoId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports.isValidMongoId = (id) => {
  if (!this.checkValidMongoId(id)) throw new Error("Invalid user ID");
};

module.exports.isValidUserId = (id) => {
  if (!this.checkValidMongoId(id)) throw new Error("Invalid user ID");
};

module.exports.isValidProductId = (id) => {
  if (!this.checkValidMongoId(id)) throw new Error("Invalid Product ID");
};

module.exports.isValidId = (id) => {
  if (!this.checkValidMongoId(id)) throw new Error("Invalid ID");
};

module.exports.isValidCoupon = (id) => {
  if (!this.checkValidMongoId(id)) throw new Error("Invalid Coupon");
};
