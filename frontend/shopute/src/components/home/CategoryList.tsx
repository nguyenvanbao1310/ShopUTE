import { FC, useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  parentId: number | null;
}

const iconMap: Record<string, string> = {
  Laptop: "💻",
  "Desktop PC": "🖥️",
  "Linh kiện PC": "🧩",
  "Phụ kiện": "🎧",
  "Màn hình": "🖥️",
  "Laptop Gaming": "🎮",
  "Laptop Văn phòng": "💼",
  MacBook: "🍎",
  CPU: "🧠",
  Mainboard: "🔌",
  RAM: "📏",
  "Ổ cứng SSD/HDD": "💾",
  "Card đồ hoạ (GPU)": "🎨",
  Chuột: "🖱️",
  "Bàn phím": "⌨️",
  "Tai nghe": "🎧",
};

const CategoryList: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>(
          "http://localhost:8088/api/categories/all"
        );

        // chỉ lấy category cha (nếu muốn lấy hết thì bỏ filter)
        const parentCategories = res.data.filter(
          (cat) => cat.parentId === null
        );

        setCategories(parentCategories);
      } catch (error) {
        console.error("Lỗi khi fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Danh mục sản phẩm</h2>
      <div className="flex justify-center gap-6 max-w-6xl mx-auto flex-wrap">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow hover:shadow-lg transition cursor-pointer w-40"
          >
            <span className="text-6xl mb-4">
              {iconMap[cat.name] || cat.name.charAt(0).toUpperCase()}
            </span>
            <h3 className="text-lg font-medium text-center">{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
