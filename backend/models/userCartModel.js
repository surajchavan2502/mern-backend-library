import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    bookId: {
      type: Types.ObjectId,
      ref: "books",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = model("cart", cartSchema);
export default cartModel;
