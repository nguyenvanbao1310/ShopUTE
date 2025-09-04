import Category from "./Category";
import Product from "./Product";
import ProductImage from "./ProductImage";
import Order from "./Order";
import OrderDetail from "./OrderDetail";
import ProductDiscount from "./ProductDiscount";

export function associateModels() {
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
}

export { Category, Product, ProductImage, Order, OrderDetail, ProductDiscount };
