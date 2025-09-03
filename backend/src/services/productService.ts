import dotenv from "dotenv";
dotenv.config();

import {
  Op,
  col,
  literal,
  type Includeable,
  type Order,
  type FindAttributeOptions,
  Transaction,
} from "sequelize";
import sequelize from "../config/configdb";

import * as ProductModel from "../models/Product";
import * as ProductImageModel from "../models/ProductImage";
import * as CategoryModel from "../models/Category";
import * as OrderDetailModel from "../models/OrderDetail";

const Product: any =
  (ProductModel as any).default || (ProductModel as any).Product;
const ProductImage: any =
  (ProductImageModel as any).default || (ProductImageModel as any).ProductImage;
const Category: any =
  (CategoryModel as any).default || (CategoryModel as any).Category;
const OrderDetail: any =
  (OrderDetailModel as any).default || (OrderDetailModel as any).OrderDetail;

class HttpError extends Error {
  constructor(public status: number, msg: string) {
    super(msg);
  }
}

const baseAttrs: FindAttributeOptions = [
  "id",
  "name",
  "description",
  "price",
  "originalPrice",
  "thumbnailUrl",
  "viewCount",
  "stock",
  "status",
  "categoryId",
  "createdAt",
  "updatedAt",
  "brand",
  "cpu",
  "ram",
  "storage",
  "gpu",
  "screen",
  [
    literal(
      "ROUND((IFNULL(originalPrice, price) - price)/NULLIF(IFNULL(originalPrice, price),0)*100,2)"
    ),
    "discountPercent",
  ],
];

function buildIncludeCommon(): Includeable[] {
  const imagesOrder: Order = [["position", "ASC"]];
  return [
    { model: Category, as: "Category", attributes: ["id", "name"] },
    {
      model: ProductImage,
      as: "Images",
      attributes: ["id", "url", "position"],
      separate: true,
      order: imagesOrder,
    },
  ];
}

export type ProductPayload = {
  name: string;
  price: string;                // decimal lưu string để không mất precision
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  categoryId: number;
  brand: string;
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  description?: string | null;
  originalPrice?: string | null;
  thumbnailUrl?: string | null;
};

export async function createProductSvc(payload: ProductPayload) {
  // Validate category
  const category = await Category.findByPk(payload.categoryId);
  if (!category) {
    const err: any = new Error("Category not found");
    err.status = 400;
    throw err;
  }

  return sequelize.transaction(async (t: Transaction) => {
    const created = await Product.create(
      {
        ...payload,
        viewCount: 0,
      },
      { transaction: t }
    );
    return created;
  });
}

export async function updateProductSvc(
  id: number,
  payload: Partial<ProductPayload>
) {
  const product = await Product.findByPk(id);
  if (!product) {
    const err: any = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  if (payload.categoryId) {
    const category = await Category.findByPk(payload.categoryId);
    if (!category) {
      const err: any = new Error("Category not found");
      err.status = 400;
      throw err;
    }
  }

  await product.update(payload);
  return product;
}

/** 1) 08 sản phẩm mới nhất */
export async function getNewestProductsSvc(limit = 8) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["createdAt", "DESC"]],
    limit,
    subQuery: false,
  });
}

/** 2) 06 sản phẩm bán chạy nhất (tính theo SUM(OrderDetails.quantity)) */
export async function getBestSellersSvc(limit = 6) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: [
      ...(baseAttrs as any),
      [
        sequelize.fn("SUM", sequelize.col("OrderDetails.quantity")),
        "totalSold",
      ],
    ],
    include: [
      ...buildIncludeCommon(),
      { model: OrderDetail, as: "OrderDetails", attributes: [] },
    ],
    group: ["Product.id"],
    order: [[literal("totalSold"), "DESC"]],
    limit,
    subQuery: false,
  });
}

/** 3) 08 sản phẩm được xem nhiều nhất (viewCount) */
export async function getMostViewedSvc(limit = 8) {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["viewCount", "DESC"]],
    limit,
    subQuery: false,
  });
}

/** 4) 04 sản phẩm khuyến mãi cao nhất (discountPercent) */
export async function getTopDiscountSvc(limit = 4) {
  return Product.findAll({
    where: { status: "ACTIVE", originalPrice: { [Op.gt]: col("price") } },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [[literal("discountPercent"), "DESC"] as any],
    limit,
    subQuery: false,
  });
}

/** (Giữ nguyên) chi tiết sản phẩm – tự tăng view */
export async function getProductDetailSvc(id?: number | string) {
  const pid = Number(id);
  if (!pid) throw new HttpError(400, "Invalid product id");

  const product = await Product.findOne({
    where: { id: pid },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
  });

  if (!product || product.status !== "ACTIVE")
    throw new HttpError(404, "Product not found");

  await product.increment("viewCount", { by: 1 });
  await product.reload();

  const data = product.toJSON() as any;
  data.inStock = product.stock > 0;
  data.stockLeft = product.stock;
  return data;
}

//Toàn bộ sản phẩm
export async function getAllProductsSvc() {
  return Product.findAll({
    where: { status: "ACTIVE" },
    attributes: baseAttrs,
    include: buildIncludeCommon(),
    order: [["createdAt", "DESC"]],
    subQuery: false,
  });
}
