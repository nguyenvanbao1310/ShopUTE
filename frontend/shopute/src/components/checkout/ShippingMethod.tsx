const ShippingMethod = () => {
  const mockShipping = {
    method: "Giao hàng nhanh",
    fee: 15000,
    estimate: "19 - 20 Tháng 9",
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl shadow">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Phương thức vận chuyển
        </h2>
      </div>

      {/* Box */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900 mb-1">{mockShipping.method}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Dự kiến giao {mockShipping.estimate}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {mockShipping.fee.toLocaleString()}₫
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
