import { Router } from "express";
import adminBookRouter from "./adminBookRouter.js";
import userBookRouter from "../user/userBookRouter.js";
import { isSuperAdminMiddleware } from "../../../utils/jwtTokens.js";
import userAdminRouter from "./userAdminRouter.js";

const protectedRouter = Router();

//routes
protectedRouter.use("/book", isSuperAdminMiddleware, adminBookRouter);
protectedRouter.use("/admin", isSuperAdminMiddleware, userAdminRouter);
protectedRouter.use("/user", userBookRouter);

export default protectedRouter;
