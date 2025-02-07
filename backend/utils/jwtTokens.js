import jwt from "jsonwebtoken";
import crypto from "crypto";
import { errorResponse } from "./serverResponce.js";

//
const key = crypto.randomBytes(32).toString("hex");

//function for generate token
export function generateToken(payload) {
  //create token
  const token = jwt.sign(payload, key, {
    expiresIn: "5m",
  });

  //create refre token
  const refreshtoken = jwt.sign(payload, key, {
    expiresIn: "2h",
  });

  return { token, refreshtoken };
}

//function for verify token
export function verifyToken(token) {
  try {
    return jwt.verify(token, key);
  } catch (error) {
    console.log("error", error.message);
    return null;
  }
}

//function for middleware
export async function authMiddleware(req, res, next) {
  try {
    const bearertoken = req.headers.authorization || req.headers.Authorization;

    if (!bearertoken) {
      return errorResponse(res, 401, "Authorization header is missing");
    }
    const tokendata = bearertoken.split(" ");
    console.log("token data", tokendata);

    if (!tokendata || tokendata?.length !== 2 || tokendata[0] !== "Bearer") {
      return errorResponse(res, 401, "invalid token");
    }
    const payload = verifyToken(tokendata[1]);
    if (!payload) {
      return errorResponse(res, 401, "Token is Invalid");
    }
    console.log("payload", payload);

    //declare locals
    res.locals.email = payload.email;
    res.locals.role = payload.role;
    next();
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Internal server error");
  }
}

//function for super admin

export async function isSuperAdminMiddleware(req, res, next) {
  try {
    const role = res.locals.role;
    if (!role || role !== "superadmin") {
      return errorResponse(res, 401, "not authorized");
    }
    next();
  } catch (error) {
    console.log(error);
    return errorResponse(res, "Internal server error");
  }
}
