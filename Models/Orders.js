import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: String,
        id: Number,
        image: String,
        varient: String,
        quantity: Number,
        prices: Array,
        price: Number,
      },
    ],
    total: Number,
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.model("Order", orderSchema);

// Export the Order model
export default Order;
