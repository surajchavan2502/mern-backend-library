import { Router } from "express";
import { errorResponse } from "../../utils/serverResponce.js";
import borrowedBookModel from "../../models/borrowedBook.js";
const borrowedBookRouter = Router();

//routes
borrowedBookRouter.post("/borrowed", borrowedBookController);

export default borrowedBookRouter;

//borrowed book controller

async function borrowedBookController(req, res) {
  try {
    const { bookId, returnDate } = req.body;
    const userId = req.users.id;

    //check book availability
    const book = await borrowedBookModel.findById(bookId);
  } catch (error) {
    console.log("_borrowedBookController_", error);
    errorResponse(res, 500, "Internal Server error");
  }
}
