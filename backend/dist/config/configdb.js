"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize("shopute", "root", "751676Kh@", {
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
