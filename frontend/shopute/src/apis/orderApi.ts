// orderApi.ts
import { api } from "./base";

export interface Product {
  id: number;
  name: string;
  price: string;
  thumbnailUrl: string;
}

export interface OrderDetail {
  id: number;
  Product: Product;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  code: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "CANCELLED"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCEL_REQUESTED";
  paymentMethod: string;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  totalAmount: string;
  deliveryAddress: string;
  OrderDetails: OrderDetail[];
}

export async function getUserOrders(): Promise<Order[]> {
  const res = await api.get<{ orders: Order[] }>("/order/user");
  return res.data.orders;
}

export async function cancelOrder(orderId: number): Promise<void> {
  await api.post("/order/cancel", { orderId });
}

export async function payOrderCOD(orderId: number): Promise<void> {
  await api.post("/order/pay-cod", { orderId });
}
