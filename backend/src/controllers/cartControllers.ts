import { Request, Response } from "express";
import * as CartService from "../services/cartService";

export const getMyCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const data = await CartService.getCartDetail(userId);
    return res.json({ success: true, data });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "GET_CART_FAILED" });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "productId required" });
    const item = await CartService.addItem(userId, Number(productId), Number(quantity || 1));
    return res.json({ success: true, itemId: item.id });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "ADD_ITEM_FAILED" });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { quantity, selected } = req.body;
    const item = await CartService.updateItem(userId, Number(id), { quantity, selected });
    return res.json({ success: true, itemId: item.id });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "UPDATE_ITEM_FAILED" });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await CartService.removeItem(userId, Number(id));
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "REMOVE_ITEM_FAILED" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await CartService.clearCart(userId);
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "CLEAR_CART_FAILED" });
  }
};

export const toggleSelectAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { selected } = req.body;
    await CartService.toggleSelectAll(userId, !!selected);
    return res.json({ success: true });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e.message || "TOGGLE_SELECT_ALL_FAILED" });
  }
};
