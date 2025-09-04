import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  parentId?: number;
}

interface Image {
  id: number;
  url: string;
  position: number;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  price: string;
  finalPrice: string; // giá sau giảm
  discountPercent: string; // phần trăm giảm
  status: string;
  stock: number;
  sold: string;
  thumbnailUrl: string; // ảnh chính
  categoryId: number;
  Category: Category;
  Images: Image[];
}

export default function TopDiscountProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8088/api/products/top-discount"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch top discount products", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🔥 Khuyến mãi cao nhất
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl shadow hover:shadow-lg cursor-pointer transition group"
          >
            {/* Image wrapper */}
            <div className="relative bg-gray-50 rounded-t-xl flex items-center justify-center h-44">
              {/* Badge Sale */}
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                -{parseFloat(product.discountPercent)}%
              </span>

              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="max-h-36 object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-pink-600 transition">
                {product.name}
              </h3>

              {/* Prices */}
              <div className="mt-2">
                <span className="text-lg font-bold text-red-500">
                  {(parseFloat(product.finalPrice) || 0).toLocaleString()}₫
                </span>
                <span className="ml-2 text-sm line-through text-gray-400">
                  {(parseFloat(product.price) || 0).toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
