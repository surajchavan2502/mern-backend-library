import { Router } from "express";
import { hashPassword } from "../../../utils/encryptPassword.js";
import userModel from "../../../models/userModel.js";
import {
  errorResponse,
  successResponse,
} from "../../../utils/serverResponce.js";

const userAdminRouter = Router();

//routes
userAdminRouter.get("/getall", getallAdminController);
userAdminRouter.post("/create", createAdminController);
userAdminRouter.put("/update", updateAdminController);
userAdminRouter.delete("/delete", deleteAdminController);

export default userAdminRouter;

// get all controller
async function getallAdminController(req, res) {
  try {
    const { email, role } = res.locals;
    console.log("locals:", email, role);

    const allUsers = await userModel.findOne({ email });
    return successResponse(res, "Success", allUsers);
  } catch (error) {
    console.log("_getAllAdminController_", error);
    errorResponse(res, 500, "internal server error");
  }
}
//create admin controller
async function createAdminController(req, res) {
  try {
    const { fname, lname, email, password, role } = req.body;
    console.log("user data:", req.body);

    //check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "User already exist");
    }

    //create a new user
    await userModel.create({
      fname,
      lname,
      email,
      password: hashPassword(password),
      role,
    });
  } catch (error) {
    console.log("_createAdminController_", error);
    errorResponse(res, 500, "internal server error");
  }
}

// update admin controller
async function updateAdminController(req, res) {
  try {
    const id = req.query?.trim();
    const updateData = req.body;

    if (!id) {
      return errorResponse(res, 400, "id is not provided");
    }
    const updateDataUser = await userModel.findByIdAndUpdate(id, updateData);
    return successResponse(res, "Suceessfully Updated", updateDataUser);
  } catch (error) {
    console.log("_updateAdminController_", error);
    errorResponse(res, 500, "internal server error");
  }
}
//delete admin controller
async function deleteAdminController(req, res) {
  try {
    const id = req.id?.trim();

    if (!id) {
      return errorResponse(res, 400, "id is not provided");
    }

    const deleteUser = await userModel.findOneAndDelete(id);
    return successResponse(res, "Suceesfully deletyed", deleteUser);
  } catch (error) {
    console.log("_deleteAdminController_", error);
    errorResponse(res, 500, "Internal Server Error");
  }
}
