import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

/** Khởi tạo transporter SMTP thật từ .env (bắt buộc) */
async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 587);
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass || !from) {
    throw new Error(
      "Thiếu cấu hình SMTP. Cần SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM trong .env"
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = TLS, 587 = STARTTLS
    auth: { user, pass },
  });

  // Kiểm tra kết nối SMTP ngay khi khởi tạo (fail-fast nếu sai)
  await transporter.verify();

  return transporter;
}

/** Gửi OTP trực tiếp tới email người dùng */
export async function sendOTPEmail(to: string, otp: string) {
  const tx = await getTransporter();

  const from =
    process.env.SMTP_FROM ||
    process.env.SMTP_USER!; // đã check ở trên rồi, yên tâm non-null

  const minutes = process.env.OTP_EXPIRE_MINUTES || "10";

  const info = await tx.sendMail({
    from,
    to,
    subject: "Mã xác thực OTP - UTEShop",
    text: `Mã OTP của bạn là: ${otp} (hiệu lực ${minutes} phút)`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2 style="margin:0 0 8px">Chào bạn,</h2>
        <p>Mã OTP của bạn là:</p>
        <div style="font-size:22px;font-weight:700;letter-spacing:3px;
                    padding:12px 16px;border:1px dashed #999;display:inline-block">
          ${otp}
        </div>
        <p style="margin-top:12px">OTP có hiệu lực trong <b>${minutes} phút</b>.</p>
        <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
      </div>
    `,
  });

  // Trả về messageId để log/debug nếu cần
  return info.messageId;
}

/** (Tuỳ chọn) gọi khi server boot để báo lỗi SMTP sớm */
export async function initMailer() {
  try {
    await getTransporter();
    console.log("✉️  SMTP mailer ready");
  } catch (err) {
    console.error("✉️  SMTP config error:", err);
  }
}
