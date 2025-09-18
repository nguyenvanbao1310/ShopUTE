import { Router } from "express";
import * as CartCtrl from "../controllers/cartControllers";

const router = Router();

// yêu cầu đăng nhập để thao tác giỏ hàng lưu trên API
router.get("/", CartCtrl.getMyCart);
router.post("/items", CartCtrl.addItem);
router.patch("/items/:id", CartCtrl.updateItem);
router.delete("/items/:id", CartCtrl.removeItem);
router.delete("/clear", CartCtrl.clearCart);

// tuỳ UI: chọn/bỏ chọn tất cả (không ảnh hưởng tính tiền vì không checkout)
router.post("/toggle-select-all", CartCtrl.toggleSelectAll);

export default router;
