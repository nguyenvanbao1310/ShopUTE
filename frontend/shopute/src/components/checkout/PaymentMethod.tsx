import { useState } from "react";

const PaymentMethod = () => {
  const [selected, setSelected] = useState("COD");

  const methods = [
    { 
      id: "COD", 
      label: "Thanh toán khi nhận hàng",
      icon: "💵",
      desc: "Trả tiền mặt khi nhận hàng"
    },
    { 
      id: "VNPAY", 
      label: "Ví VNPAY",
      icon: "🏦",
      desc: "Thanh toán qua ví điện tử VNPAY"
    },
    { 
      id: "MOMO", 
      label: "Ví Momo",
      icon: "📱",
      desc: "Thanh toán qua ví điện tử Momo"
    },
    { 
      id: "CARD", 
      label: "Thẻ tín dụng/Ghi nợ",
      icon: "💳",
      desc: "Visa, MasterCard, JCB"
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path 
              fillRule="evenodd" 
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Phương thức thanh toán
        </h2>
      </div>
      
      <div className="space-y-3">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`block p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
              selected === method.id
                ? "border-green-300 bg-green-50 shadow-md"
                : "border-gray-200 hover:border-green-200 hover:bg-green-50/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selected === method.id}
                onChange={() => setSelected(method.id)}
                className="w-5 h-5 text-green-600 border-2 border-gray-300 focus:ring-green-500"
              />
              <div className="text-2xl">{method.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-500">{method.desc}</p>
              </div>
              {selected === method.id && (
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
