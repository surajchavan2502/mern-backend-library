import { Router } from "express";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponce.js";
import bookModel from "../../../models/adminBookModule.js";

//
const adminBookRouter = Router();

//rotues
adminBookRouter.get("/getall", getallBookController);
adminBookRouter.post("/create", createBookController);
adminBookRouter.put("/update", updatebookController);
adminBookRouter.delete("/delete", deleteBookController);

export default adminBookRouter;

//get all book controller
async function getallBookController(req, res) {
  try {
    const { email, role } = res.locals;
    console.log("locals:", email, role);
    const books = await bookModel.find();
    return successResponse(res, "Success", books);
  } catch (error) {
    console.log("_getallBlogController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//create book controller
async function createBookController(req, res) {
  try {
    if (!res.locals.email || !res.locals.role) {
      return errorResponse(res, 401, "Unathorized access");
    }
    const { email, role } = res.locals;

    const { title, author, ISBN_code, category, publishedDate } = req.body;
    console.log(email);

    const book = await bookModel.create({
      title,
      author,
      ISBN_code,
      category,
      publishedDate,
      email,
      role,
    });
    return errorResponse(res, "book created successfully", book);
  } catch (error) {
    console.log("_createBookController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
//update book controller
async function updatebookController(req, res) {
  try {
    const id = req.query.id?.trim();
    const updateBookData = req.body;

    if (!id) {
      return errorResponse(res, 400, "is is not provided");
    }

    const updateBook = await bookModel.findByIdAndUpdate(id, updateBookData);
    return successResponse(res, "Book data updated successfully", updateBook);
  } catch (error) {
    console.log("_updatebookcontroller_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

//delete book controller
async function deleteBookController(req, res) {
  try {
    const id = req.id?.trim();

    if (!id) {
      return errorResponse(res, 400, "ID is not provided");
    }
    const deleteBook = await bookModel.findByIdAndDelete(id);
    return successResponse(res, "Book deleted successfully", deleteBook);
  } catch (error) {
    console.log("_deleteBookController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
