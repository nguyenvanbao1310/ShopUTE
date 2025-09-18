// src/cronJobs/index.ts
import cron from "node-cron";
import { autoConfirmOrders } from "./autoConfirmOrders";

export function startCronJobs() {
  // chạy mỗi phút
  cron.schedule(" * * * * *", async () => {
    console.log("⏰ Running autoConfirmOrders...");
    await autoConfirmOrders();
  });
}
