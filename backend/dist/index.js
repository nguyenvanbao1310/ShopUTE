"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const configdb_1 = require("./config/configdb"); // đường dẫn tới file db.ts
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8088;
app.use(express_1.default.json());
app.use("/api/", authRoutes_1.default);
// Kết nối DB
(0, configdb_1.connectDB)();
// Routes
app.get("/", (req, res) => {
    res.send("Backend chạy bằng TypeScript 🚀");
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map