import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/configdb";
import Cart from "./Cart";
import Product from "./Product";

export interface CartItemAttrs {
  id: number;
  cartId: number;
  productId: number;
  quantity: number; // số lượng muốn mua
  selected: boolean; // chọn để checkout hay không
  unitPriceSnapshot?: string | null; // tuỳ chọn: chụp giá tại thời điểm thêm (DECIMAL)
  createdAt?: Date;
  updatedAt?: Date;
}
type CartItemCreationAttrs = Optional<
  CartItemAttrs,
  "id" | "selected" | "unitPriceSnapshot" | "createdAt" | "updatedAt"
>;

class CartItem
  extends Model<CartItemAttrs, CartItemCreationAttrs>
  implements CartItemAttrs
{
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public selected!: boolean;
  public unitPriceSnapshot!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    selected: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    unitPriceSnapshot: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: true,
  }
);

// FK + Associations


export default CartItem;
