import { Request, Response, NextFunction } from "express";

export function deviceContext(req: Request, res: Response, next: NextFunction) {
  const deviceId =
    (req.headers["x-device-id"] as string) ||
    (req.query.deviceId as string) ||
    (req.body?.deviceId as string);

  // Nếu chưa login và cũng không có deviceId => không biết giỏ nào để thao tác
  if (!deviceId && !(req as any).user?.id) {
    return res.status(400).json({ success: false, message: "deviceId is required for guest cart" });
  }
  (req as any).deviceId = deviceId || null;
  next();
}
