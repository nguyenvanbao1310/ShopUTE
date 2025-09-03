import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createCategory,
  updateCategory,
  getAllCategories,
} from "../controllers/categoryControllers";

const router = Router();

router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.get("/all", getAllCategories);

export default router;
