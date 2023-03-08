const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
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
    limit: {
      type: Number,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    quantity: {
      type: Number,
      // required: true,
    },
    fakeQuantity: {
      type: Number,
      // required: true,
    },
    images: [
      {
        asset_id: { type: String },
        public_id: { type: String },
        url: { type: String },
      },
    ],
    color: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    bannerProduct: {
      type: Boolean,
      default: false,
    },
    banner: {
      title: {
        type: String,
      },
      text: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
