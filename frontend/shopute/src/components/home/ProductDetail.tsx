import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star, Heart, Share, ShoppingCart, Truck, CreditCard, Twitter, Facebook, Instagram } from "lucide-react";
import FeaturedProducts from "./NewProducts";
import Layout from "../../layouts/MainLayout";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  thumbnailUrl: string;
  categoryId: number;
  Category: { name: string };
  Images: { url: string; position: number }[];
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  discountPercent?: number;
  finalPrice?: number;
}

interface Rating {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: { name: string };
}

const ProductDetail: FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    axios
      .get(`http://localhost:8088/api/products/${id}`)
      .then((res) => {
        console.log("Product data:", res.data);
        setProduct(res.data);
      })
      .catch((err) => console.error("Lỗi lấy sản phẩm:", err))
      .finally(() => setLoading(false));

    axios
      .get(`http://localhost:8088/api/products/${id}/ratings`)
      .then((res) => {
        console.log("Ratings data:", res.data);
        setRatings(res.data || []); // Đảm bảo ratings là mảng rỗng nếu không có dữ liệu
      })
      .catch((err) => {
        console.error("Lỗi lấy đánh giá:", err);
        setRatings([]); // Đặt rỗng nếu 404
      })
      .finally(() => setRatingsLoading(false));
  }, [id]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://placehold.co/500x500?text=Image+Not+Found"; // Thay fallback
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + change, product?.stock || 1)));
  };

  if (loading) return <p className="text-center py-6">Đang tải...</p>;
  if (!product) return <p className="text-center py-6">Không tìm thấy sản phẩm</p>;

  const finalPrice = product.finalPrice || (product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price);

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
    : 0;

  const colors = ["Black", "Silver", "Gold"];
  const shippingOptions = [
    { id: "standard", name: "Standard Shipping (3-5 days)", price: 5.99 },
    { id: "express", name: "Express Shipping (2-3 days)", price: 12.99 },
    { id: "free", name: "Free Shipping (5-7 days)", price: 0 },
  ];
  const paymentOptions = [
    { id: "credit", name: "Credit Card" },
    { id: "paypal", name: "PayPal" },
    { id: "bank", name: "Bank Transfer" },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Banner breadcrumb */}
        <div className="bg-gray-800 py-8 text-center">
          <div className="container mx-auto px-6">
            <nav className="text-sm text-gray-300 mb-2">
              <Link to="/" className="hover:underline">Home</Link> &gt;{" "}
              <Link to={`/category/${product.Category.name.toLowerCase()}`} className="hover:underline">
                {product.Category.name}
              </Link> &gt;{" "}
              <span className="text-white font-semibold">{product.name}</span>
            </nav>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          </div>
        </div>

        {/* Nội dung chi tiết sản phẩm */}
        <div className="-mt-6 relative z-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Swiper hình ảnh */}
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="w-full h-[500px] rounded-lg overflow-hidden"
                >
                  {product.Images.length > 0 ? (
                    product.Images.map((image) => (
                      <SwiperSlide key={image.position}>
                        <img
                          src={image.url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = product.thumbnailUrl; // Sử dụng thumbnailUrl làm fallback nếu URL trong Images không tải được
                          }}
                        />
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </SwiperSlide>
                  )}
                </Swiper>

                {/* Thumbnail nhỏ */}
                <div className="flex justify-center space-x-2 mt-4">
                  {product.Images.length > 0 ? (
                    product.Images.map((image) => (
                      <img
                        key={image.position}
                        src={image.url}
                        alt={product.name}
                        className="w-16 h-16 object-cover cursor-pointer border rounded hover:border-blue-500"
                        onError={(e) => {
                          e.currentTarget.src = product.thumbnailUrl; // Sử dụng thumbnailUrl làm fallback
                        }}
                      />
                    ))
                  ) : (
                    <img
                      src={product.thumbnailUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover cursor-pointer border rounded hover:border-blue-500"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="space-y-6">
                {/* Đánh giá */}
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">({ratings.length} Reviews)</span>
                </div>

                {/* Giá tiền */}
                <div className="space-x-4">
                  {product.discountPercent && product.discountPercent > 0 ? (
                    <span className="text-gray-400 line-through text-lg">
                      {product.price.toLocaleString()} VNĐ
                    </span>
                  ) : null}
                  <span className="text-blue-600 font-bold text-3xl">
                    {finalPrice.toLocaleString()} VNĐ
                  </span>
                  {product.discountPercent && product.discountPercent > 0 ? (
                    <span className="text-red-500 text-lg">(-{product.discountPercent}%)</span>
                  ) : null}
                </div>

                {/* Mô tả */}
                <div>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                {/* Chọn màu & số lượng */}
                <div className="space-y-4 border-t border-b py-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex space-x-3">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                          style={{
                            backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                            color.toLowerCase() === 'silver' ? '#c0c0c0' :
                                            color.toLowerCase() === 'gold' ? '#ffd700' : '#fff'
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stock)))
                        }
                        className="w-16 text-center border border-gray-300 rounded-lg p-2"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                      <span className="text-gray-500 text-sm">({product.stock} available)</span>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center">
                      <ShoppingCart size={20} className="mr-2" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 border border-gray-300 rounded-lg flex items-center justify-center ${
                        isFavorite
                          ? "text-red-500 bg-red-50 border-red-200"
                          : "text-gray-600 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isFavorite ? "fill-current" : ""}
                      />
                    </button>
                  </div>
                </div>

                {/* Information */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-4 text-lg">Information</h3>
                  <div className="space-y-3 text-gray-700">
                    <div><span className="font-medium">CPU:</span> {product.cpu || "N/A"}</div>
                    <div><span className="font-medium">RAM:</span> {product.ram || "N/A"}</div>
                    <div><span className="font-medium">Storage:</span> {product.storage || "N/A"}</div>
                    <div><span className="font-medium">GPU:</span> {product.gpu || "N/A"}</div>
                    <div><span className="font-medium">Screen:</span> {product.screen || "N/A"}</div>
                    <div><span className="font-medium">Battery:</span> 8,220 mAh</div>
                    <div><span className="font-medium">Dimensions:</span> 171.4 x 243.1 x 7.9 mm</div>
                    <div><span className="font-medium">Weight:</span> 547 g</div>
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div className="space-y-6">
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center mb-3">
                      <Truck size={20} className="text-gray-600 mr-2" />
                      <h3 className="font-semibold text-lg">Shipping</h3>
                    </div>
                    <select
                      value={selectedShipping}
                      onChange={(e) => setSelectedShipping(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select shipping method</option>
                      {shippingOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} {option.price > 0 ? `- $${option.price.toFixed(2)}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center mb-3">
                      <CreditCard size={20} className="text-gray-600 mr-2" />
                      <h3 className="font-semibold text-lg">Payment</h3>
                    </div>
                    <select
                      value={selectedPayment}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select payment method</option>
                      {paymentOptions.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center">
                      <Share size={20} className="mr-2" />
                      Share:
                    </h3>
                    <div className="flex space-x-4">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Twitter size={24} />
                      </button>
                      <button className="text-pink-600 hover:text-pink-800 transition-colors">
                        <Instagram size={24} />
                      </button>
                      <button className="text-blue-800 hover:text-blue-900 transition-colors">
                        <Facebook size={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Featured */}
          <div className="py-6">
            <div className="mb-6">
              {/* Tổng reviews */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Reviews total: {ratings.length}</h2>
                <div className="flex items-center">
                  <span className="mr-2 font-semibold">Overall rating {averageRating.toFixed(1)}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label htmlFor="sort" className="mr-2 font-medium">Sort</label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>

              {/* Danh sách reviews */}
              <div className="space-y-6">
                {ratingsLoading ? (
                  <p>Loading reviews...</p>
                ) : ratings.length > 0 ? (
                  ratings.map((rating) => (
                    <div key={rating.id} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{rating.user.name}</h4>
                        <span className="text-gray-500 text-sm">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < Math.round(rating.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{rating.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>

              {/* Form viết review */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Write a review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2">Rating*</label>
                    <select className="w-full p-2 border border-gray-300 rounded" required>
                      <option value="">Choose rating</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Review*</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
                      placeholder="Share your experience with this product"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Submit Review
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            <FeaturedProducts />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;