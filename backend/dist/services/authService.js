"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSvc = registerUserSvc;
exports.verifyOtpSvc = verifyOtpSvc;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel = __importStar(require("../models/User"));
const mailer_1 = require("./mailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = UserModel.default || UserModel.User;
const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const OTP_MIN = Number(process.env.OTP_EXPIRE_MINUTES || 10);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
    throw new Error("Missing JWT_SECRET");
class HttpError extends Error {
    constructor(status, msg) {
        super(msg);
        this.status = status;
    }
}
const genOTP = () => Math.floor(100000 + Math.random() * 900000);
async function registerUserSvc(input) {
    const { email, password, firstName, lastName, phone } = input;
    if (!password)
        throw new HttpError(400, "Thiếu mật khẩu");
    const emailNorm = email.trim().toLowerCase();
    // Không cho đăng ký nếu đã có trong Users
    if (await User.findOne({ where: { email: emailNorm } }))
        throw new HttpError(409, "Email đã tồn tại");
    if (await User.findOne({ where: { phone } }))
        throw new HttpError(409, "Số điện thoại đã tồn tại");
    // Hash password
    const passwordHash = await bcryptjs_1.default.hash(password, SALT);
    // OTP (number only)
    const otp = genOTP();
    const otpHash = await bcryptjs_1.default.hash(otp.toString(), SALT);
    const otpExpireDate = new Date(Date.now() + OTP_MIN * 60 * 1000);
    // Đóng gói dữ liệu vào regToken (KHÔNG lưu DB)
    const payload = {
        email: emailNorm,
        passwordHash,
        firstName,
        lastName,
        phone,
        otpHash,
        otpExpire: otpExpireDate.toISOString(),
    };
    const regToken = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    // Gửi OTP qua email
    await (0, mailer_1.sendOTPEmail)(emailNorm, otp);
    if (process.env.NODE_ENV !== "production")
        console.log("[DEV OTP]", emailNorm, otp);
    // Trả token cho FE lưu tạm (localStorage/memory) để gọi verify
    return { regToken };
}
async function verifyOtpSvc(input) {
    const { regToken, otp } = input;
    if (!regToken || otp === undefined || otp === null)
        throw new HttpError(400, "Thiếu regToken hoặc otp");
    if (typeof otp !== "number" || !Number.isInteger(otp))
        throw new HttpError(400, "OTP phải là số");
    let data;
    try {
        data = jsonwebtoken_1.default.verify(regToken, JWT_SECRET);
    }
    catch {
        throw new HttpError(401, "regToken không hợp lệ hoặc đã hết hạn");
    }
    const expMs = new Date(data.otpExpire).getTime();
    if (isNaN(expMs) || expMs < Date.now())
        throw new HttpError(410, "OTP đã hết hạn, vui lòng đăng ký lại");
    const ok = await bcryptjs_1.default.compare(otp.toString(), data.otpHash);
    if (!ok)
        throw new HttpError(400, "OTP không đúng");
    // Double-check tránh race (có thể ai đó vừa tạo user với email này trước khi verify)
    if (await User.findOne({ where: { email: data.email } }))
        throw new HttpError(409, "Email đã tồn tại");
    if (await User.findOne({ where: { phone: data.phone } }))
        throw new HttpError(409, "Số điện thoại đã tồn tại");
    // Tạo user thực sự sau khi verify
    const user = await User.create({
        email: data.email,
        password: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        otp: null,
        otpExpire: null,
        role: "user",
    });
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role };
}
//# sourceMappingURL=authService.js.map