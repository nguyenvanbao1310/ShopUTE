import bcrypt from "bcryptjs";
// Tương thích cả default export lẫn named export { User }
import * as UserModel from "../models/User";
import { sendOTPEmail } from "./mailer";

const User: any = (UserModel as any).default || (UserModel as any).User;

const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const OTP_MIN = Number(process.env.OTP_EXPIRE_MINUTES || 10);

class HttpError extends Error {
  constructor(public status: number, msg: string) {
    super(msg);
  }
}
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function registerUserSvc(input: {
  email: string;
  password?: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  phone: string;
}) {
  const { email, password, confirmPassword, firstName, lastName, phone } =
    input;
  if (!password) throw new HttpError(400, "Thiếu mật khẩu");

  if (password !== confirmPassword)
    throw new HttpError(400, "Mật khẩu và xác nhận mật khẩu không khớp");

  // Tránh trùng
  if (await User.findOne({ where: { email } }))
    throw new HttpError(409, "Email đã tồn tại");
  if (await User.findOne({ where: { phone } }))
    throw new HttpError(409, "Số điện thoại đã tồn tại");

  // Hash mật khẩu
  const passwordHash = await bcrypt.hash(password, SALT);

  // OTP
  const otp = genOTP();
  const otpHash = await bcrypt.hash(otp, SALT);
  const otpExpire = new Date(Date.now() + OTP_MIN * 60 * 1000);

  // Tạo user (role mặc định 'user' theo migration)
  const user = await User.create({
    email,
    password: passwordHash,
    firstName,
    lastName,
    phone,
    otp: otpHash,
    otpExpire,
    role: "user",
  });

  // Gửi email
  await sendOTPEmail(email, otp);

  // Trả về dữ liệu cần thiết cho FE
  return {
    id: user.id,
    email: user.email,
    firstName,
    lastName,
    phone,
    role: user.role,
  };
}

export async function verifyOtpSvc(input: { email?: string; otp?: string }) {
  const email = input.email?.trim().toLowerCase();
  const otp = input.otp;
  if (!email || !otp) throw new HttpError(400, "Thiếu email hoặc otp");

  const user = await User.findOne({ where: { email } });
  if (!user?.otp || !user.otpExpire)
    throw new HttpError(400, "Không tìm thấy yêu cầu xác thực");
  if (user.otpExpire.getTime() < Date.now())
    throw new HttpError(410, "OTP đã hết hạn");

  const ok = await bcrypt.compare(otp, user.otp);
  if (!ok) throw new HttpError(400, "OTP không đúng");

  user.otp = null;
  user.otpExpire = null;
  await user.save();
}
