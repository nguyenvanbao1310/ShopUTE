import AddressSection from "../components/checkout/AddressSection";
import ProductList from "../components/checkout/ProductList";
import VoucherSection from "../components/checkout/VoucherSection";
import ShippingMethod from "../components/checkout/ShippingMethod";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";

const Checkout = () => {
  const mockCartItems = [
    {
      id: 1,
      name: "Áo Thun Nam MA1-23620",
      price: 91771,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
      variant: "Trắng, L",
    },
    {
      id: 2,
      name: "Quần dài nam nữ HT67",
      price: 76032,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
      variant: "Xám muối tiêu, M",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
          Thanh toán đơn hàng
        </h1>
        <p className="text-gray-600">
          Hoàn tất đơn hàng của bạn chỉ với vài bước đơn giản
        </p>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-6">
          <AddressSection />
          <ProductList items={mockCartItems} />
          <VoucherSection />
          <ShippingMethod />
          <PaymentMethod />
        </div>

        {/* Cột phải */}
        <div>
          <OrderSummary items={mockCartItems} shippingFee={15000} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
