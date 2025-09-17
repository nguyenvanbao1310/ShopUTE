import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Star, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";

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
  averageRating: number | { id: number; count: number };
  Category: Category;
  Images: { url: string; position: number }[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse {
  products: Product[];
  pagination: PaginationInfo;
}

const CategoryPage: FC = () => {
  const { categoryName = "" } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortOption, setSortOption] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedBatteries, setSelectedBatteries] = useState<string[]>([]);
  const [showAllDimensions, setShowAllDimensions] = useState(true);

  // Helper function với type guard
  const getAverageRatingValue = (rating: number | { id: number; count: number }): number => {
    if (typeof rating === 'number') {
      return rating;
    }
    if (typeof rating === 'object' && rating !== null && 'count' in rating) {
      return rating.count;
    }
    return 0;
  };

  // Hàm fetch products với phân trang
  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `http://localhost:8088/api/products/category/${categoryName}?page=${page}&limit=12`
      );
      console.log("API Response:", response.data); // Log toàn bộ phản hồi
    console.log("Products:", response.data.products); // Log mảng products
      if (page === 1) {
        setProducts(response.data.products);
      } else {
        setProducts((prev) => [...prev, ...response.data.products]);
      }

      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);

    // Lấy all categories cho sidebar
    axios
      .get("http://localhost:8088/api/categories/all")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi lấy categories:", err));
  }, [categoryName]);

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Hàm xử lý chọn bộ lọc pin
  const handleBatteryChange = (battery: string) => {
    if (selectedBatteries.includes(battery)) {
      setSelectedBatteries(selectedBatteries.filter((b) => b !== battery));
    } else {
      setSelectedBatteries([...selectedBatteries, battery]);
    }
  };

  // Sắp xếp sản phẩm client-side
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    if (sortOption === "price-asc") return a.finalPrice - b.finalPrice;
    if (sortOption === "price-desc") return b.finalPrice - a.finalPrice;
    return 0;
  });

  if (loading && products.length === 0) return <p className="text-center py-6">Đang tải...</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-blue-600">
          Mainpage
        </Link>{" "}
        &gt; {categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1)}
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
                    checked={cat.name.toLowerCase() === categoryName}
                    readOnly
                  />
                  {cat.name}
                </label>
              </li>
            ))}
            <li>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showAllDimensions}
                  onChange={() => setShowAllDimensions(!showAllDimensions)}
                />
                Show All
              </label>
            </li>
          </ul>

          {/* Bộ lọc pin (Battery Filter) */}
          <h3 className="font-bold mt-6 mb-4">Battery Type</h3>
          <ul className="space-y-2">
            {["Li-ion", "NiMH", "Alkaline"].map((battery) => (
              <li key={battery}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedBatteries.includes(battery)}
                    onChange={() => handleBatteryChange(battery)}
                  />
                  {battery}
                </label>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="col-span-3">
          {/* Header với sort và view options */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">
              {categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1)}
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({pagination.totalProducts} sản phẩm)
              </span>
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="mr-2 text-sm">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="p-2 border rounded text-sm"
                >
                  <option value="default">Default</option>
                  <option value="name-asc">Name (A - Z)</option>
                  <option value="name-desc">Name (Z - A)</option>
                  <option value="price-asc">Price (Low &gt; High)</option>
                  <option value="price-desc">Price (High &gt; Low)</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Mô tả danh mục */}
          <div className="bg-gray-100 p-4 rounded mb-6">
            <p className="text-gray-700">
              {categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1)} category description.
            </p>
          </div>

          {/* Product list */}
          {sortedProducts.length === 0 && !loading ? (
            <p className="text-center py-10 text-gray-500">No products found in this category.</p>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={
                      viewMode === "grid"
                        ? "bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        : "flex bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    }
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-48 object-contain mb-2"
                      />
                    </Link>
                    <div className={viewMode === "list" ? "ml-4 flex-1" : ""}>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold">{product.name}</h3>
                      </Link>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const ratingValue = getAverageRatingValue(product.averageRating);
                          return (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(ratingValue)
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              }
                            />
                          );
                        })}
                        <span className="ml-2">
                          ({getAverageRatingValue(product.averageRating).toFixed(1)})
                        </span>
                      </div>
                      <div className="mt-2">
                        {product.discountPercent > 0 && (
                          <span className="text-gray-400 line-through mr-2">
                            ${typeof product.price === "number" ? product.price.toLocaleString() : "0"}
                          </span>
                        )}
                        <span className="text-red-600 font-bold">
                          ${typeof product.finalPrice === "number" ? product.finalPrice.toLocaleString() : "0"}
                        </span>
                      </div>
                      <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className={`px-3 py-2 border rounded flex items-center ${
                        pagination.hasPrev ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <ChevronLeft size={16} className="mr-1" /> Prev
                    </button>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 border rounded ${
                          pagination.currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className={`px-3 py-2 border rounded flex items-center ${
                        pagination.hasNext ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {loading && products.length > 0 && (
            <div className="text-center py-4">
              <p>Đang tải thêm sản phẩm...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;