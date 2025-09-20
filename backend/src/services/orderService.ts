import { Transaction } from "sequelize";
import sequelize from "../config/configdb";
import Order from "../models/Order";
import OrderDetail from "../models/OrderDetail";
import Product from "../models/Product";
import User from "../models/User";
import type { OrderCreationAttributes } from "../models/Order";
import type { OrderDetailCreationAttributes } from "../models/OrderDetail";
import { OrderStatus, PaymentStatus } from "../types/order";
import CancelRequest from "../models/CancelRequest";

export interface CreateOrderInput extends OrderCreationAttributes {
  details: Omit<OrderDetailCreationAttributes, "orderId">[];
}

export interface CancelResult {
  type: "cancelled" | "request";
  order?: Order;
  message?: string;
}

export async function createOrder(data: CreateOrderInput) {
  const t = await sequelize.transaction();
  try {
    const totalAmount = data.details
      .reduce((sum, d) => sum + parseFloat(d.subtotal), 0)
      .toFixed(2);

    const order = await Order.create(
      {
        userId: data.userId ?? null,
        code: data.code,
        totalAmount,
        status: "PENDING",
        paymentMethod: data.paymentMethod ?? null,
        paymentStatus: "UNPAID",
        note: data.note ?? null,
      },
      { transaction: t }
    );
    const details = data.details.map((d) => ({
      ...d,
      orderId: order.id,
    }));
    await OrderDetail.bulkCreate(details, { transaction: t });
    await t.commit();
    return { order, details };
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function payOrderCOD(orderId: number) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) {
      throw new Error("Order can't found ");
    }
    if (order.paymentMethod !== "COD") {
      throw new Error("Payment method isn't COD");
    }
    if (order.paymentStatus === "PAID") {
      throw new Error("Order already paid");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Order has been cancelled");
    }
    order.paymentStatus = "PAID";
    order.status = "COMPLETED";
    await order.save({ transaction: t });
    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function confirmOrder(orderId: number) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) {
      throw new Error("Order could't find");
    }
    if (order.status === OrderStatus.CONFIRMED) {
      throw new Error("Order has been confirmed");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot confirm order in status: ${order.status}`);
    }
    order.status = OrderStatus.CONFIRMED;
    await order.save({ transaction: t });
    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}
export async function shipOrder(orderId: number) {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error(
        `Only confirmed orders can be shipped. Current: ${order.status}`
      );
    }

    order.status = OrderStatus.SHIPPED;
    await order.save({ transaction: t });

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export async function cancelPendingOrder(
  orderId: number
): Promise<CancelResult> {
  const t: Transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");

    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot cancel order in status: ${order.status}`);
    }

    order.status = OrderStatus.CANCELLED;
    if (order.paymentStatus === PaymentStatus.PAID) {
      order.paymentStatus = PaymentStatus.REFUNDED;
    }

    await order.save({ transaction: t });
    await t.commit();

    return { type: "cancelled", order };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}

export async function requestCancelOrder(
  orderId: number,
  userId?: number,
  reason?: string
): Promise<CancelResult> {
  const t: Transaction = await sequelize.transaction();
  try {
    const order = await Order.findByPk(orderId, { transaction: t });
    if (!order) throw new Error("Order not found");

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error(
        `Cannot request cancel for order in status: ${order.status}`
      );
    }

    await CancelRequest.create(
      {
        orderId: order.id,
        userId: userId ?? null,
        reason: reason ?? "No reason provided",
        status: "PENDING",
      },
      { transaction: t }
    );

    order.status = OrderStatus.CANCEL_REQUESTED;
    await order.save({ transaction: t });

    await t.commit();
    return { type: "request", message: "Cancel request sent to shop" };
  } catch (err) {
    await t.rollback();
    throw err;
  }
}
export async function getUserOrders(userId: number) {
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderDetail,
        as: "OrderDetails", // ✅ phải đúng alias đã khai báo
        include: [
          {
            model: Product,
            as: "Product", // alias đúng trong association
          },
        ],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return orders;
}
