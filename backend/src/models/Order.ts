import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/configdb";

export interface OrderAttributes {
  id: number;
  userId: number | null;          // nếu có bảng Users; tạm cho phép null
  code: string;                   // mã đơn (unique)
  totalAmount: string;            // DECIMAL -> string
  status: "PENDING" | "PAID" | "CANCELLED" | "SHIPPED" | "COMPLETED";
  paymentMethod?: string | null;  // COD, VNPAY, MOMO...
  paymentStatus?: "UNPAID" | "PAID" | "REFUNDED";
  note?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    "id" | "userId" | "paymentMethod" | "paymentStatus" | "note" | "createdAt" | "updatedAt"
  > {}

class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public userId!: number | null;
  public code!: string;
  public totalAmount!: string;
  public status!: "PENDING" | "PAID" | "CANCELLED" | "SHIPPED" | "COMPLETED";
  public paymentMethod!: string | null;
  public paymentStatus!: "UNPAID" | "PAID" | "REFUNDED";
  public note!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    totalAmount: { type: DataTypes.DECIMAL(14, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "CANCELLED", "SHIPPED", "COMPLETED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    paymentMethod: { type: DataTypes.STRING(30), allowNull: true },
    paymentStatus: {
      type: DataTypes.ENUM("UNPAID", "PAID", "REFUNDED"),
      allowNull: false,
      defaultValue: "UNPAID",
    },
    note: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
  }
);

export default Order;
