"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = sendOTPEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
let transporter = null;
async function getTransporter() {
    if (transporter)
        return transporter;
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    if (!host || !user || !pass || !from) {
        throw new Error("Thiếu cấu hình SMTP (.env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM)");
    }
    transporter = nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465, // 465 TLS, 587 STARTTLS
        auth: { user, pass },
    });
    await transporter.verify(); // fail-fast nếu cấu hình sai
    return transporter;
}
async function sendOTPEmail(to, otp) {
    const tx = await getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const minutes = process.env.OTP_EXPIRE_MINUTES || "10";
    await tx.sendMail({
        from,
        to,
        subject: "Mã xác thực OTP - UTEShop",
        text: `Mã OTP của bạn là: ${otp} (hiệu lực ${minutes} phút)`,
        html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h3 style="margin:0 0 8px">Mã OTP của bạn:</h3>
        <div style="font-size:22px;font-weight:700;letter-spacing:3px;
                    padding:12px 16px;border:1px dashed #999;display:inline-block">
          ${otp}
        </div>
        <p style="margin-top:12px">OTP có hiệu lực trong <b>${minutes} phút</b>.</p>
      </div>
    `,
    });
}
//# sourceMappingURL=mailer.js.map