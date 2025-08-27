import { Sequelize } from "sequelize";

const sequelize = new Sequelize("shopute", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// 👉 export cả instance sequelize để models, migration dùng
export default sequelize;
