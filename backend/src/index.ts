import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 8088;

app.use(express.json());

// Route mẫu
app.get("/", (req: Request, res: Response) => {
  res.send("Backend chạy bằng TypeScript 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
