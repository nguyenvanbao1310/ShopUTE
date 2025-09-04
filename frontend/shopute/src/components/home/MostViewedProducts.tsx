import { FC, useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: string;
  finalPrice: string;
  discountPercent: string;
  thumbnailUrl: string;
}

const MostViewedProducts: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8088/api/products/most-viewed")
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Error fetching most viewed products:", err)
      );
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      {/* Danh sách sản phẩm bên trái */}
      <div className="col-span-2">
        <h2 className="text-lg font-bold mb-4">Most view</h2>

        {/* 2 cột */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center border p-3 rounded-lg cursor-pointer hover:shadow-lg hover:-translate-y-1 transition"
            >
              {/* Ảnh */}
              <img
                src={p.thumbnailUrl}
                alt={p.name}
                className="w-16 h-16 object-contain"
              />

              {/* Thông tin */}
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {p.name}
                </h3>

                {/* Giá */}
                <div className="flex items-center mt-1">
                  {parseFloat(p.discountPercent) > 0 && (
                    <span className="text-gray-400 line-through text-xs mr-2">
                      {Number(p.price).toLocaleString()}₫
                    </span>
                  )}
                  <span className="text-indigo-600 font-semibold text-base">
                    {Number(p.finalPrice).toLocaleString()}₫
                  </span>
                  {parseFloat(p.discountPercent) > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">
                      -{p.discountPercent}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link xem tất cả */}
        <div className="mt-4">
          <a href="/specials" className="text-pink-600 text-sm hover:underline">
            All Products &gt;
          </a>
        </div>
      </div>

      {/* Banner bên phải */}
      <div className="col-span-1 flex items-center justify-center">
        <img
          src="/img/most_view.jpg"
          alt="Most view"
          className="w-[500px] h-[300px] object-cover rounded-xl"
        />
      </div>
    </section>
  );
};

export default MostViewedProducts;
