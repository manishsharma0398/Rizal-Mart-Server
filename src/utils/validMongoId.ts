import mongoose from "mongoose";

export const checkValidMongoId = (id: string) =>
  mongoose.Types.ObjectId.isValid(id);

export const isValidMongoId = (id: string) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid user ID");
};

export const isValidUserId = (id: string) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid user ID");
};

export const isValidProductId = (id: string) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid Product ID");
};

export const isValidId = (id: string) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid ID");
};

export const isValidCoupon = (id: string) => {
  if (!checkValidMongoId(id)) throw new Error("Invalid Coupon");
};
