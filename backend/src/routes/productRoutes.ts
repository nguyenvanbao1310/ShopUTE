// routes/productRoutes.ts
import { Router } from "express";
import {
  newestProducts,
  bestSellers,
  mostViewed,
  topDiscount,
  getProductDetail,
  getAllProducts,
  createProduct,
  updateProduct,
} from "../controllers/productControllers";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Lists
router.get("/newest", authMiddleware, newestProducts);       // 08 sản phẩm mới nhất
router.get("/best-sellers", authMiddleware, bestSellers);    // 06 sản phẩm bán chạy nhất
router.get("/most-viewed", authMiddleware, mostViewed);      // 08 sản phẩm xem nhiều
router.get("/top-discount", authMiddleware, topDiscount);    // 04 sản phẩm giảm sâu
router.get("/all", authMiddleware, getAllProducts);

// Create / Update
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);

// Detail (auto +1 view)
router.get("/:id", getProductDetail);

export default router;
