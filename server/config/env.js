const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: process.env.PORT || 5001,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5174",
  PISTON_URL:
    process.env.PISTON_URL || "https://emkc.org/api/v2/piston",
};

module.exports = env;