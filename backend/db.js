import { connect } from "mongoose";
import serverConfig from "./serverConfig.js";

async function dbConnect() {
  try {
    await connect(serverConfig.mongodb_url, {
      timeoutMS: 10000,
    });
    console.log("db connected sucessfully");
  } catch (error) {
    throw error;
  }
}

export default dbConnect;
