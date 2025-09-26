import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchAddresses } from "../../store/addressSlice";
import { useEffect, useState } from "react";

const AddressSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { defaultAddress, addresses, loading } = useSelector(
    (state: RootState) => state.address
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);
  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(defaultAddress || addresses[0]);
    }
  }, [addresses, defaultAddress]);

  if (loading) {
    return <p>Đang tải địa chỉ...</p>;
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-green-100">
        <p className="text-gray-600">Bạn chưa có địa chỉ mặc định</p>
        <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg">
          Thêm địa chỉ mới
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Phần hiển thị địa chỉ */}
      <div className="group relative bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 p-6 border border-green-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl shadow">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Địa chỉ nhận hàng
            </h2>
          </div>

          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-lg">
                 ${user?.firstName || ""} ${user?.lastName || ""}
                </span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-green-600 font-medium">
                  {selectedAddress?.phone}
                </span>
              </p>
              <p className="text-gray-600 leading-relaxed">
                {selectedAddress?.street}, {selectedAddress?.ward},{" "}
                {selectedAddress?.province}
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow hover:from-green-500 hover:to-emerald-600 transition-all duration-300 hover:scale-105 text-sm font-medium"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      {/* Modal chọn địa chỉ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Chọn địa chỉ</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedAddress?.id === addr.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowModal(false);
                  }}
                >
                  <p className="font-semibold">{addr.street}, {addr.ward}</p>
                  <p className="text-sm text-gray-500">{addr.province}</p>
                  <p className="text-sm text-gray-500">{addr.phone}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressSection;
