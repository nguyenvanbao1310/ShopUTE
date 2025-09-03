import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { createProductImage, updateProductImage, getAllProductImages } from "../controllers/productImageControllers";

const router = Router();

router.post("/", authMiddleware, createProductImage);
router.put("/:id", authMiddleware, updateProductImage);
router.get("/all", authMiddleware, getAllProductImages);

export default router;
