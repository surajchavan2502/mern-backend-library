import "dotenv/config";

const serverConfig = {
  port: process.env.PORT || 5008,
  mongodb_url: process.env.MONGODB_URL || "",
  frontendPath: "../frontend/dist",
  SECRET_KEY: process.env.SECRET_KEY,
};

export default serverConfig;
