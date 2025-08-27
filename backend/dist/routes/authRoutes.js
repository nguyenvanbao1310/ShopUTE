"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User"); // model sequelize
const authControllers_1 = require("../controllers/authControllers");
const validateRegister_1 = require("../middleware/validateRegister");
// const app = express();
// app.use(express.json());
const router = (0, express_1.Router)();
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Tìm user theo email
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" });
        }
        // 2. So sánh mật khẩu
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu" });
        }
        // 3. Tạo JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "mysecret", { expiresIn: "1h" });
        // 4. Trả về token
        res.json({
            message: "Đăng nhập thành công",
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});
router.post("/register", validateRegister_1.validateRegister, authControllers_1.register);
router.post("/verify-otp", authControllers_1.verifyOtp);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map