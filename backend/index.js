import express from "express";
import serverConfig from "./serverConfig.js";
import path from "path";
import publicRouter from "./routes/public/publicRouter.js";
import dbConnect from "./db.js";
import { authMiddleware } from "./utils/jwtTokens.js";

import createSuperAdmin from "./utils/superAdmin.js";
import protectedRouter from "./routes/protected/admin/protectedRouter.js";

//
const app = express();
const port = serverConfig.port;
const dir = path.resolve();

//path
app.use(express.json());
//frontend path
app.use(express.static(path.join(dir, serverConfig.frontendPath)));

//api routers
app.use("/api/public", publicRouter);
app.use("/api/protected", authMiddleware, protectedRouter);
//path not found
app.all("*", (req, res) => {
  res.status(404).json({ message: " path not found" });
});

try {
  await dbConnect();
  app.listen(port, () => {
    console.log(`started listening at http://localhost:${port}`);
    createSuperAdmin();
  });
} catch (error) {
  console.log("server initialization error", error);
}
