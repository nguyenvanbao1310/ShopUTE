// src/types/order.ts
export interface Product {
  id: number;
  name: string;
  price: number; // <-- nên để number thay vì string
  thumbnailUrl: string;
}

export interface OrderDetail {
  id: number;
  Product: Product;
  quantity: number;
  subtotal: number; // <-- đổi từ string -> number
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
  totalAmount: number; // <-- đổi từ string -> number
  deliveryAddress: string;
  OrderDetails: OrderDetail[];
  createdAt: string; // <-- thêm
  updatedAt: string; // <-- thêm
}
export interface CancelOrderResponse {
  type: "cancelled" | "request";
  order?: Order; // khi type === "cancelled"
  message?: string; // khi type === "request"
}
