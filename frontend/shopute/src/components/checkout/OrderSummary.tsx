interface OrderSummaryProps {
  items: { price: number; quantity: number }[];
  shippingFee: number;
}
 
const OrderSummary = ({ items, shippingFee }: OrderSummaryProps) => {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const finalTotal = total + shippingFee;

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Tóm tắt đơn hàng</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="font-semibold">{total.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-semibold text-green-600">{shippingFee.toLocaleString()}₫</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-4">
              <div className="flex justify-between py-2">
                <span className="text-xl font-bold text-gray-900">Tổng thanh toán</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  {finalTotal.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            Đặt hàng ngay
          </button>
        </div>
      </div>
    </div>
  );
};


export default OrderSummary;
