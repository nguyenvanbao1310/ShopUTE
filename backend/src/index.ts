import express, { Request, Response } from "express";
import { connectDB } from "./config/configdb"; // đường dẫn tới file db.ts
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes"; 
import productRoutes from "./routes/productRoutes";
import authForgotRoutes from "./routes/authForgotRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productImageRoutes from "./routes/productImageRoutes";

import { associateModels } from "./models";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8088;

associateModels();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // nếu cần gửi cookie
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authForgotRoutes);


app.use(express.json());
app.use("/api/", authRoutes);
app.use("/api/users", userRoutes); // thêm dòng này
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/product-images", productImageRoutes);
// Kết nối DB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Backend chạy bằng TypeScript 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
