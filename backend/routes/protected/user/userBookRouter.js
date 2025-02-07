import { Router } from "express";
import bookModel from "../../../models/adminBookModule.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponce.js";
import userModel from "../../../models/userModel.js";
import cartModel from "../../../models/userCartModel.js";
import borrowedBookModel from "../../../models/borrowedBook.js";

const userBookRouter = Router();

//routes
userBookRouter.get("/getall", getallBookuserController);
userBookRouter.get("/addcart", addCartBookuserController);
userBookRouter.post("/buy", buyBookuserController);
userBookRouter.get("/get-cart", getCartBookuserController);
userBookRouter.get("/get-borrow", getBorrowedBookuserController);

export default userBookRouter;

//get all book controller
async function getallBookuserController(req, res) {
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

//add to cart book controller
async function addCartBookuserController(req, res) {
  try {
    const { email } = res.locals;
    const { bookId } = req.body;

    if (!bookId) {
      return errorResponse(res, 400, "Book ID is required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const existingCartItem = await cartModel.findOne({
      userId: user._id,
      bookId,
    });

    if (existingCartItem) {
      return errorResponse(res, 400, "Book is already in the cart");
    }
    const newCartItem = new cartModel({ userId: user._id, bookId });
    await newCartItem.save();
    return successResponse(res, "Book is added into the cart");
  } catch (error) {
    console.log("_addCartBookuserContrller_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

// buy book controller

async function buyBookuserController(req, res) {
  try {
    const { email } = res.locals;

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const cartItems = await cartModel.find({ userId: user._id });
    if (cartItems.length === 0) {
      return errorResponse(res, 400, "cart is empty");
    }
    const borrowedBooks = [];
    for (let cartItem of cartItems) {
      const book = await bookModel.findById(cartItem.bookId);

      if (!book || book.availableCopies <= 0) {
        continue;
      }
      const exsitingBorrow = await borrowedBookModel.findOne({
        userId: user._id,
        bookId: book._id,
        returned: false,
      });
      if (exsitingBorrow) {
        continue;
      }
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 15);
      const newBorrow = new borrowedBookModel({
        userId: user._id,
        bookId: book._id,
        borrowDate: new Date(),
        returnDate,
        returned: false,
      });
      await newBorrow.save();
      borrowedBooks.push(newBorrow);
      book.availableCopies -= 1;
      await book.save();
    }
    await cartModel.deleteOne({ userId: user._id });
    if (borrowedBooks.length === 0) {
      return errorResponse(res, 400, "No books are available");
    }
    return successResponse(res, "Borrowed books successfully", borrowedBooks);
  } catch (error) {
    console.log("_buyBookController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
// async function buyBookuserController(req, res) {
//   try {
//     const { email } = res.locals;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return errorResponse(res, 404, "User not found");
//     }

//     // Fetch books in the user's cart
//     const cartItems = await cartModel.find({ userId: user._id });
//     if (cartItems.length === 0) {
//       return errorResponse(res, 400, "Cart is empty");
//     }

//     const borrowedBooks = [];
//     const unavailableBooks = [];

//     for (let cartItem of cartItems) {
//       const book = await bookModel.findById(cartItem.bookId);

//       if (!book) {
//         unavailableBooks.push(`Book ID ${cartItem.bookId} not found`);
//         continue;
//       }

//       if (book.availableCopies <= 0) {
//         unavailableBooks.push(`Book "${book.title}" is out of stock`);
//         continue;
//       }

//       const existingBorrow = await borrowedBookModel.findOne({
//         userId: user._id,
//         bookId: book._id,
//         returned: false,
//       });

//       if (existingBorrow) {
//         unavailableBooks.push(`You have already borrowed "${book.title}"`);
//         continue;
//       }

//       // Process borrowing
//       const returnDate = new Date();
//       returnDate.setDate(returnDate.getDate() + 15);

//       const newBorrow = new borrowedBookModel({
//         userId: user._id,
//         bookId: book._id,
//         borrowDate: new Date(),
//         returnDate,
//         returned: false,
//       });

//       await newBorrow.save();
//       borrowedBooks.push(newBorrow);

//       // Decrease available copies
//       book.availableCopies -= 1;
//       await book.save();
//     }

//     // Remove cart items only if books were successfully borrowed
//     if (borrowedBooks.length > 0) {
//       await cartModel.deleteMany({ userId: user._id });
//       return successResponse(res, "Borrowed books successfully", borrowedBooks);
//     }

//     return errorResponse(res, 400, {
//       message: "No books are available",
//       unavailableBooks,
//     });
//   } catch (error) {
//     console.log("_buyBookController_", error);
//     return errorResponse(res, 500, "Internal server error");
//   }
// }

//get all cart controller
async function getCartBookuserController(req, res) {
  try {
    const { email } = res.locals;

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User is not found");
    }

    const cartItems = await cartModel.find({ userId: user._id }); // populate book id here
    if (cartItems.length === 0) {
      return errorResponse(res, 400, "Cart is empty");
    }

    const cartBooks = await cartModel.find();
    return successResponse(res, "added books in the cart: ", cartBooks);
  } catch (error) {
    console.log("_getCartBookUserController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
async function getBorrowedBookuserController(req, res) {
  try {
    const { email } = res.locals;

    const user = await userModel.findOne({ email });
  } catch (error) {
    console.log("_getBorrowedBookUserController_", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
