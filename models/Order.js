const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        count: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paymentMode: {
      type: String,
      required: true,
      enum: [
        "Cash On Delivery",
        "Internet Banking",
        "Credit Card",
        "Debit Card",
        "UPI",
        "Wallet",
      ],
    },
    status: {
      type: String,
      default: "Not Processed",
      required: true,
      enum: [
        "Cancelled",
        "Not Processed",
        "Processing",
        "Dispatched",
        "Out For Delivery",
        "Delivered",
      ],
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
