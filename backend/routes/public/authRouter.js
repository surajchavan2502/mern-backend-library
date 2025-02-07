import { Router } from "express";
import { errorResponse, successResponse } from "../../utils/serverResponce.js";
import userModel from "../../models/userModel.js";
import { comparePassword } from "../../utils/encryptPassword.js";
import { generateToken } from "../../utils/jwtTokens.js";

//auth router
const authRouter = Router();

//routes path
authRouter.post("/signin", signinController);

export default authRouter;

//sign in controller
async function signinController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "email and password are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "user not found");
    }

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid Password");
    }
    const tokens = generateToken({
      email: user.email,
      role: user.role,
    });

    return successResponse(res, "signin successfull", tokens);
  } catch (error) {
    console.log("error during signin", error);
    errorResponse(res, 500, "Internal server error");
  }
}

//get all books controller
