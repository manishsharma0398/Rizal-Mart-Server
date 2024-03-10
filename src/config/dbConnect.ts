import mongoose from "mongoose";

export const connectToDB: () => Promise<void> = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URL! as string);
  } catch (error) {
    throw new Error(error as string);
  }
};
