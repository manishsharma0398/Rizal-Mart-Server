const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    // seller: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fakePrice: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    category: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    quantity: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
