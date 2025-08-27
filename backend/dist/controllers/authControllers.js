"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const authService_1 = require("../services/authService");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET; // bạn nên cho vào process.env
if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role },
        });
    }
    catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
const register = async (req, res) => {
    try {
        const { regToken } = await (0, authService_1.registerUserSvc)(req.body);
        return res.status(201).json({
            message: "Đăng ký thành công. Vui lòng kiểm tra email để nhập OTP xác thực.",
            regToken
        });
    }
    catch (e) {
        return res.status((e === null || e === void 0 ? void 0 : e.status) || 500).json({ message: (e === null || e === void 0 ? void 0 : e.message) || "Lỗi máy chủ" });
    }
};
exports.register = register;
const verifyOtp = async (req, res) => {
    try {
        const user = await (0, authService_1.verifyOtpSvc)(req.body);
        return res.status(200).json({ message: "Xác thực OTP thành công", user });
    }
    catch (e) {
        return res.status((e === null || e === void 0 ? void 0 : e.status) || 500).json({ message: (e === null || e === void 0 ? void 0 : e.message) || "Lỗi máy chủ" });
    }
};
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=authControllers.js.map