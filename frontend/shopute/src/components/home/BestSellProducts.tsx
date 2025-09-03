import { FC, useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

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
  finalPrice: string;
  discountPercent: string;
  status: string;
  stock: number;
  sold: string;
  thumbnailUrl: string;
  categoryId: number;
  Category: Category;
  Images: Image[];
}

const BestSellProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:8088/api/products/best-sellers") // 🔥 đổi URL theo backend của bạn
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {/* Banner bên trái */}
      <div className="relative col-span-1 md:col-span-1">
        <img
          src="/img/banner-new.jpg"
          alt="New products"
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 px-3 py-2 rounded-lg">
          <h2 className="text-xl font-bold">Top Selling</h2>
          <a href="#" className="text-pink-500 text-sm hover:underline">
            View All
          </a>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="relative border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
          >
            {/* Label giảm giá */}
            {parseFloat(p.discountPercent) > 0 && (
              <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                -{p.discountPercent}%
              </span>
            )}

            {/* Ảnh sản phẩm */}
            <img
              src={p.thumbnailUrl}
              alt={p.name}
              className="w-full h-32 object-contain cursor-pointer"
            />

            <div className="mt-3 leading-relaxed">
              <p className="text-sm text-gray-500">{p.Category?.name}</p>

              {/* Tên sản phẩm */}
              <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                {p.name}
              </h3>

              {/* Giá */}
              <div className="mt-2">
                {parseFloat(p.discountPercent) > 0 && (
                  <span className="text-gray-400 line-through text-sm mr-2">
                    {Number(p.price).toLocaleString()}₫
                  </span>
                )}
                <span className="text-pink-600 font-bold text-lg">
                  {Number(p.finalPrice).toLocaleString()}₫
                </span>
              </div>

              {/* Sold count */}
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <Star
                  size={16}
                  className="text-yellow-500 mr-1"
                  fill="currentColor"
                />
                <span>Đã bán {p.sold}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellProducts;
