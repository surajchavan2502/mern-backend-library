import Schema from "mongoose";

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  ISBN_code: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
  },
});

const bookModel = model("books", bookSchema);
export default bookModel;
