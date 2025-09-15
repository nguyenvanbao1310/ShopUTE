"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const configdb_1 = require("./config/configdb"); // đường dẫn tới file db.ts
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authForgotRoutes_1 = __importDefault(require("./routes/authForgotRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productImageRoutes_1 = __importDefault(require("./routes/productImageRoutes"));
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8088;
app.use("/images", express_1.default.static(path_1.default.join(process.cwd(), "public/images")));
(0, models_1.associateModels)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // nếu cần gửi cookie
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", authForgotRoutes_1.default);
app.use(express_1.default.json());
app.use("/api/", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default); // thêm dòng này
app.use("/api/products", productRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/product-images", productImageRoutes_1.default);
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