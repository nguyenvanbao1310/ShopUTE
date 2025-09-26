import { useState } from "react";

const VoucherSection = () => {
  const [showVouchers, setShowVouchers] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl shadow">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 5a3 3 0 015-2.236A3 3 0 0115 5a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V8a3 3 0 013-3zm4 2H5a1 1 0 00-1 1v6a1 1 0 001 1h4V7zm2 10h4a1 1 0 001-1V8a1 1 0 00-1-1h-4v10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Mã giảm giá</h2>
      </div>

      {/* Nút chọn voucher */}
      <button
        onClick={() => setShowVouchers(!showVouchers)}
        className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:scale-[1.02] group"
      >
        <div className="flex items-center justify-center gap-2 text-green-700 font-medium">
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Chọn hoặc nhập mã voucher
        </div>
      </button>
    </div>
  );
};

export default VoucherSection;
