type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
};

interface ProductListProps {
  items: Product[];
}

const ProductList = ({ items }: ProductListProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl shadow">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Sản phẩm đã chọn</h2>
        <div className="flex-1"></div>
        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
          {items.length} sản phẩm
        </span>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group p-4 rounded-2xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* Hình ảnh */}
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Thông tin */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg inline-block">
                  {item.variant}
                </p>
              </div>

              {/* Giá và số lượng */}
              <div className="text-right space-y-1">
                <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {item.price.toLocaleString()}₫
                </p>
                <p className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full">
                  SL: {item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
