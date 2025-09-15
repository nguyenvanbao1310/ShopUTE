import Category from "./Category";
import Product from "./Product";
import ProductImage from "./ProductImage";
import Order from "./Order";
import OrderDetail from "./OrderDetail";
import ProductDiscount from "./ProductDiscount";
import Cart from "./Cart";
import User from "./User";
import CartItem from "./CartItem"

export function associateModels() {
  Category.belongsTo(Category, {
    as: "parent",
    foreignKey: "parentId",
  });
  // Category ↔ Product
  Category.hasMany(Product, { as: "Products", foreignKey: "categoryId" });
  Product.belongsTo(Category, { as: "Category", foreignKey: "categoryId" });

  // Product ↔ ProductImage
  Product.hasMany(ProductImage, { as: "Images", foreignKey: "productId" });
  ProductImage.belongsTo(Product, { as: "Product", foreignKey: "productId" });

  // Order ↔ OrderDetail
  Order.hasMany(OrderDetail, { as: "OrderDetails", foreignKey: "orderId" });
  OrderDetail.belongsTo(Order, { as: "Order", foreignKey: "orderId" });

  // Product ↔ OrderDetail
  Product.hasMany(OrderDetail, { as: "OrderDetails", foreignKey: "productId" });
  OrderDetail.belongsTo(Product, { as: "Product", foreignKey: "productId" });

  // Product ↔ ProductDiscount
  Product.hasOne(ProductDiscount, { as: "discount", foreignKey: "productId" });
  ProductDiscount.belongsTo(Product, {
    as: "product",
    foreignKey: "productId",
  });

  // Cart ↔ User
  Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

  // CartItem ↔ Cart
  CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });
  Cart.hasMany(CartItem, {
    foreignKey: "cartId",
    as: "items",
    onDelete: "CASCADE",
  });

  // CartItem ↔ Product
  CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });
}

export { Category, Product, ProductImage, Order, OrderDetail, ProductDiscount, User, Cart, CartItem };
