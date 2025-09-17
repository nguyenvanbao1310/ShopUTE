import { FC } from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Laptop", icon: "📱" },
  { id: 2, name: "Tablets", icon: "💻" },
  { id: 3, name: "Notebooks", icon: "🖥️" },
  { id: 4, name: "Monitors", icon: "🖥️" },
];

const CategoryList: FC = () => {
  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.name.toLowerCase()}`} // Điều hướng đến /category/smartphones, v.v.
            key={cat.id}
            className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <span className="text-5xl mb-3">{cat.icon}</span>
            <h3 className="text-lg font-medium">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryList;
