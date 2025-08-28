"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_PASS = process.env.DB_PASS;
const sequelize = new sequelize_1.Sequelize("shopute", "root", DB_PASS, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};
exports.connectDB = connectDB;
// 👉 export cả instance sequelize để models, migration dùng
exports.default = sequelize;
//# sourceMappingURL=configdb.js.map
