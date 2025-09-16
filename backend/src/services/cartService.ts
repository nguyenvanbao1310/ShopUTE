import { Transaction } from "sequelize";
import sequelize from "../config/configdb";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import Product from "../models/Product";

/** Lấy/khởi tạo giỏ hàng theo user */
export async function getOrCreateCartByUser(userId: number, deviceId?: string | null) {
  let cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, as: "items" }],
  });
  if (!cart) {
    cart = await Cart.create({ userId, deviceId: deviceId || null });
  } else if (deviceId && cart.deviceId !== deviceId) {
    await cart.update({ deviceId });
  }
  return cart;
}

/** Thêm/cộng dồn 1 item vào giỏ*/
export async function addItem(userId: number, productId: number, quantity = 1) {
  return await sequelize.transaction(async (t: Transaction) => {
    const cart = await getOrCreateCartByUser(userId);

    // kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error("PRODUCT_NOT_FOUND");

    const existing = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (existing) {
      await existing.update(
        { quantity: existing.quantity + Math.max(1, quantity) },
        { transaction: t }
      );
      return existing;
    } else {
      const item = await CartItem.create(
        {
          cartId: cart.id,
          productId,
          quantity: Math.max(1, quantity),
          selected: true, // giữ để UI có thể tick chọn/bỏ chọn
        },
        { transaction: t }
      );
      return item;
    }
  });
}

/** Cập nhật số lượng / chọn-bỏ chọn (không có resnapshot) */
export async function updateItem(
  userId: number,
  cartItemId: number,
  params: { quantity?: number; selected?: boolean }
) {
  return await sequelize.transaction(async (t) => {
    const cart = await getOrCreateCartByUser(userId);
    const item = await CartItem.findOne({
      where: { id: cartItemId, cartId: cart.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!item) throw new Error("CART_ITEM_NOT_FOUND");

    const patch: any = {};
    if (params.quantity !== undefined) patch.quantity = Math.max(1, Number(params.quantity));
    if (params.selected !== undefined) patch.selected = !!params.selected;

    await item.update(patch, { transaction: t });
    return item;
  });
}

/** Xoá 1 item */
export async function removeItem(userId: number, cartItemId: number) {
  return await sequelize.transaction(async (t) => {
    const cart = await getOrCreateCartByUser(userId);
    const item = await CartItem.findOne({
      where: { id: cartItemId, cartId: cart.id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!item) throw new Error("CART_ITEM_NOT_FOUND");
    await item.destroy({ transaction: t });
    return true;
  });
}

/** Xoá toàn bộ giỏ */
export async function clearCart(userId: number) {
  const cart = await getOrCreateCartByUser(userId);
  await CartItem.destroy({ where: { cartId: cart.id } });
  return true;
}

/** Chọn/bỏ chọn tất cả (phục vụ UI) */
export async function toggleSelectAll(userId: number, selected: boolean) {
  const cart = await getOrCreateCartByUser(userId);
  await CartItem.update({ selected }, { where: { cartId: cart.id } });
  return true;
}

/** Lấy giỏ hàng: chỉ trả về thông tin hiển thị*/
export async function getCartDetail(userId: number) {
  const cart = await getOrCreateCartByUser(userId);
  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{ model: Product, as: "product", attributes: ["id", "name", "price", "imageUrl"] }],
    order: [["id", "ASC"]],
  });

  let totalItems = 0;    // số loại sản phẩm (distinct)
  let totalQuantity = 0; // tổng quantity

  const detailed = items.map((it) => {
    totalItems += 1;
    totalQuantity += it.quantity;

    return {
      id: it.id,
      productId: it.productId,
      name: (it as any).product?.name,
      imageUrl: (it as any).product?.imageUrl,
      // price chỉ để hiển thị tham khảo;
      price: Number((it as any).product?.price ?? 0),
      quantity: it.quantity,
      selected: it.selected,
    };
  });

  return {
    cartId: cart.id,
    totalItems,     // dùng giá trị này cho “số sản phẩm đang tồn tại trong giỏ” theo LOẠI
    totalQuantity,  // dùng cho tổng quantity nếu UI cần
    items: detailed
  };
}
