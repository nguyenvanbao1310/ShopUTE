import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Star } from "lucide-react";

interface Category {
  id: number;
  name: string;
  parentId?: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  finalPrice: number;
  discountPercent: number;
  stock: number;
  thumbnailUrl: string;
  averageRating: number; // Thêm average rating
  Category: Category;
  Images: { url: string; position: number }[];
}

const CategoryPage: FC = () => {
  const { categoryName = "" } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Lấy all categories cho sidebar
  const [sortOption, setSortOption] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid hoặc list
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy sản phẩm theo category
    axios
      .get(`http://localhost:8088/api/products/category/${categoryName}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi lấy sản phẩm:", err))
      .finally(() => setLoading(false));

    // Lấy all categories cho sidebar
    axios
      .get("http://localhost:8088/api/categories/all")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi lấy categories:", err));
  }, [categoryName]);

  // Sắp xếp sản phẩm client-side
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "price-asc") return a.finalPrice - b.finalPrice;
    if (sortOption === "price-desc") return b.finalPrice - a.finalPrice;
    return 0; // default
  });

  if (loading) return <p className="text-center py-6">Đang tải...</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/">Mainpage</Link> &gt; {categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1)}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="col-span-1 bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-4">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={cat.name.toLowerCase() === categoryName} // Check current
                  />
                  {cat.name}
                </label>
              </li>
            ))}
            <li>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Show All
              </label>
            </li>
          </ul>
          {/* Có thể thêm filter khác như Battery nếu có attributes */}
        </aside>

        {/* Main content */}
        <main className="col-span-3">
          {/* Sort và View */}
          <div className="flex justify-between mb-4">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="default">Sort by: Default</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
              <option value="price-asc">Price (Low &gt; High)</option>
              <option value="price-desc">Price (High &gt; Low)</option>
            </select>
            <div>
              <button onClick={() => setViewMode("grid")} className="mr-2">Grid</button>
              <button onClick={() => setViewMode("list")}>List</button>
            </div>
          </div>

          {/* Product list */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "space-y-4"}>
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                className={viewMode === "grid" ? "border p-4 rounded shadow" : "flex border p-4 rounded shadow"}
              >
                <Link to={`/product/${p.id}`}>
                  <img src={p.thumbnailUrl} alt={p.name} className="w-full h-48 object-contain mb-2" />
                </Link>
                <div className={viewMode === "list" ? "ml-4" : ""}>
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-semibold">{p.name}</h3>
                  </Link>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < Math.floor(p.averageRating) ? "text-yellow-500 fill-current" : "text-gray-300"} />
                    ))}
                    <span className="ml-2">({p.averageRating.toFixed(1)})</span>
                  </div>
                  <div className="mt-2">
                    {p.discountPercent > 0 && (
                      <span className="text-gray-400 line-through mr-2">
                        ${p.price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-red-600 font-bold">${p.finalPrice.toLocaleString()}</span>
                  </div>
                  <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">Add to Cart</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (đơn giản, giả sử) */}
          <div className="mt-6 text-center">
            <button className="px-4 py-2 border">Previous</button>
            <span className="mx-2">1 / 1</span>
            <button className="px-4 py-2 border">Next</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;