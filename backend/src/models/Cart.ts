import { DataTypes, Model, Optional } from "sequelize";
import sequelize  from "../config/configdb";

export interface CartAttrs {
  id: number;
  userId: number;              // gắn với người dùng đã đăng nhập
  deviceId?: string | null;    // tuỳ chọn: để merge cart khách/đăng nhập
  createdAt?: Date;
  updatedAt?: Date;
}
type CartCreationAttrs = Optional<CartAttrs, "id" | "deviceId" | "createdAt" | "updatedAt">;

class Cart extends Model<CartAttrs, CartCreationAttrs> implements CartAttrs {
  public id!: number;
  public userId!: number;
  public deviceId!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    deviceId: { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
  },
  { sequelize, modelName: "Cart", tableName: "carts", timestamps: true }
);



export default Cart;
