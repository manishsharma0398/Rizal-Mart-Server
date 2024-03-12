import { Document, Schema, model } from "mongoose";
import { randomBytes, createHash } from "crypto";
import { genSaltSync, hashSync, compare } from "bcrypt";

export interface UserDocument {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  blocked: boolean;
  refreshToken: string;
  passwordChangedAt: DateConstructor;
  passwordResetToken: string;
}

export interface UserMethods extends UserDocument, Document {
  didPasswordMatch(password: string): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
}

enum UserRoles {
  ADMIN = "admin",
  USER = "user",
  SELLER = "seller",
}

const User = new Schema<UserDocument, {}>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user",
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
  },
  { timestamps: true }
);

User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await genSaltSync(Number(process.env.BCRYPT_SALT_ROUNDS));
  const hash = await hashSync(this.password, salt);
  this.password = hash;
});

User.methods.didPasswordMatch = async function (enteredPassword: string) {
  return await compare(enteredPassword, this.password);
};

User.methods.createPasswordResetToken = async function () {
  const resetToken = randomBytes(64).toString("hex");
  this.passwordResetToken = createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 1000 * 60 * 10; //10 minutes
  return resetToken;
};

//Export the model
export default model<UserDocument>("User", User);
