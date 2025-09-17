import type { Request, Response } from "express";
import * as orderService from "../services/orderService";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const data = req.body as orderService.CreateOrderInput;
    data.userId = userId;
    const result = await orderService.createOrder(data);
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    const result = await orderService.confirmOrder(Number(orderId));
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const result = await orderService.cancelOrder(Number(orderId));
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};
export const shipOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const result = await orderService.shipOrder(Number(orderId));
    res.status(201).json(result);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ message: err.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderService.getUserOrders(userId);
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
