const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectToDB } = require("./config/dbConnect");
const { errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const couponRoutes = require("./routes/couponRoutes");

require("dotenv").config();
connectToDB();

const PORT = process.env.PORT;
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/coupon", couponRoutes);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to database");
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

mongoose.connection.on("disconnected", () => {
  logEvents(`Disconnected From mongo`, "mongoErrLog.log");
});
