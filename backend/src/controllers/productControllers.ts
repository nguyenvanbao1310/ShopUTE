import { Request, Response } from "express";
import {
  getNewestProductsSvc,
  getBestSellersSvc,
  getMostViewedSvc,
  getTopDiscountSvc,
  getProductDetailSvc,
  getAllProductsSvc,
  createProductSvc,
  updateProductSvc,
  getProductsByCategoryNameSvc,
} from "../services/productService";
import { AuthRequest } from "../middleware/auth";

//sản phẩm mới nhất
export async function newestProducts(_req: AuthRequest, res: Response) {
  try {
    const data = await getNewestProductsSvc(8);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

// bán chạy nhất
export async function bestSellers(_req: AuthRequest, res: Response) {
  try {
    const data = await getBestSellersSvc(6);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

//nhiều lượt xem nhất
export async function mostViewed(_req: AuthRequest, res: Response) {
  try {
    const data = await getMostViewedSvc(8);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}
//giảm giá nhiều nhất
export async function topDiscount(_req: AuthRequest, res: Response) {
  try {
    const data = await getTopDiscountSvc(4);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

// chi tiết – tự tăng view
export async function getProductDetail(req: AuthRequest, res: Response) {
  try {
    const idNum = Number(req.params.id);
    const data = await getProductDetailSvc(idNum);
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

// lấy toàn bộ sản phẩm
export async function getAllProducts(_req: AuthRequest, res: Response) {
  try {
    const data = await getAllProductsSvc();
    res.json(data);
  } catch (e: any) {
    res.status(e?.status || 500).json({ message: e?.message || "Internal Server Error" });
  }
}

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const data = await createProductSvc(req.body);
    res.status(201).json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const data = await updateProductSvc(id, req.body);
    res.json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

// Lấy sản phẩm theo danh mục (case-insensitive)
export async function getProductsByCategory(req: AuthRequest, res: Response) {
  try {
    const categoryName = req.params.categoryName;
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const data = await getProductsByCategoryNameSvc(categoryName);
    res.json(data);
  } catch (e: any) {
    res
      .status(e?.status || 500)
      .json({ message: e?.message || "Internal Server Error" });
  }
}

