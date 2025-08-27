import express, { Request, Response } from "express";
import { connectDB } from "./config/configdb"; // đường dẫn tới file db.ts
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8088;

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // nếu cần gửi cookie
  })
);
app.use(express.json());
app.use("/api/", authRoutes);
app.use("/api/users", userRoutes); // thêm dòng này
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
