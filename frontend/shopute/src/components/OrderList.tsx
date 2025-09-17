// src/pages/OrderList.tsx
import React, { useEffect, useState } from "react";
import Layout from "../layouts/MainLayout";
import {
  getUserOrders,
  cancelOrder,
  payOrderCOD,
  Order,
} from "../apis/orderApi";

// Định nghĩa màu cho từng trạng thái
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-400",
  CONFIRMED: "bg-blue-400",
  PREPARING: "bg-purple-400",
  SHIPPED: "bg-yellow-400",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
  CANCEL_REQUESTED: "bg-orange-400",
};

// Thứ tự trạng thái hiển thị trên progress bar
const STATUS_ORDER = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "COMPLETED",
  "CANCEL_REQUESTED",
  "CANCELLED",
];

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: number) => {
    try {
      await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
    } catch {
      alert("Cannot cancel order");
    }
  };

  const handlePayCOD = async (orderId: number) => {
    try {
      await payOrderCOD(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "COMPLETED", paymentStatus: "PAID" }
            : o
        )
      );
    } catch {
      alert("Cannot pay order");
    }
  };

  // Lấy thông tin các segment cho progress bar
  const getProgressSegments = (status: string) => {
    return STATUS_ORDER.map((s) => ({
      status: s,
      filled: STATUS_ORDER.indexOf(s) <= STATUS_ORDER.indexOf(status),
      color: STATUS_COLORS[s] || "bg-gray-200",
    }));
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm space-y-4 bg-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order #{order.code}</h2>
                <span className="text-gray-500">{order.paymentStatus}</span>
              </div>

              {/* Chi tiết sản phẩm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {order.OrderDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b py-2"
                    >
                      <img
                        src={item.Product?.thumbnailUrl}
                        alt={item.Product?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.Product?.name || "Unknown product"}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {item.quantity} x {item.subtotal}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Thông tin đơn hàng */}
                <div className="space-y-2">
                  <div>
                    <strong>Total:</strong> {order.totalAmount}
                  </div>
                  <div>
                    <strong>Status:</strong> {order.status.replace("_", " ")}
                  </div>
                  <div>
                    <strong>Payment method:</strong> {order.paymentMethod}
                  </div>
                  <div>
                    <strong>Delivery:</strong> {order.deliveryAddress}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2">
                <div className="flex h-2 w-full rounded overflow-hidden">
                  {getProgressSegments(order.status).map((seg) => (
                    <div
                      key={seg.status}
                      className={`flex-1 ${
                        seg.filled ? seg.color : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  {STATUS_ORDER.map((s) => (
                    <span key={s} className="truncate">
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thông báo trạng thái đặc biệt */}
              {order.status === "CANCELLED" && (
                <div className="text-red-500 font-semibold mt-2">
                  Order Cancelled
                </div>
              )}
              {order.status === "CANCEL_REQUESTED" && (
                <div className="text-orange-500 font-semibold mt-2">
                  Cancellation Requested
                </div>
              )}

              {/* Hành động */}
              {order.status === "PENDING" && (
                <div className="flex gap-3 mt-3">
                  <button
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handlePayCOD(order.id)}
                  >
                    Pay COD
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
