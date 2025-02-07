import { model, Schema } from "mongoose";

const borrowedBookSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "books",
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  returned: {
    type: Boolean,
    required: true,
  },
  Due: {
    type: Number,
    default: 0,
  },
});

const borrowedBookModel = model("borrowed", borrowedBookSchema);

export default borrowedBookModel;
