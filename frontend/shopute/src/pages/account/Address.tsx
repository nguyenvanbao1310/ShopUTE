import { useEffect, useState } from "react";
import { addressApi } from "../../apis/addressApi";
import {Address }from "../../types/address";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await addressApi.getAll();
      setAddresses(data);
    } catch (err) {
      console.error("Lỗi tải địa chỉ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      await addressApi.remove(id);
      fetchData();
    } catch (err) {
      console.error("Xóa thất bại:", err);
    }
  };

  const handleSave = async (form: {
    street: string;
    ward: string;
    province: string;
    phone: string;
    isDefault?: boolean;
  }) => {
    try {
      if (editing) {
        await addressApi.update(editing.id, form);
      } else {
        await addressApi.create(form);
      }
      setShowForm(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      console.error("Lưu địa chỉ thất bại:", err);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Địa chỉ của tôi</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border p-4 rounded flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">
                {addr.street}, {addr.ward}, {addr.province}
              </p>
              <p className="text-gray-600">SĐT: {addr.phone}</p>
              {addr.isDefault && (
                <span className="text-xs text-red-600 border border-red-600 px-2 py-1 rounded">
                  Mặc định
                </span>
              )}
            </div>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEditing(addr);
                  setShowForm(true);
                }}
                className="text-blue-600"
              >
                Cập nhật
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AddressForm
          editing={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

interface FormProps {
  editing: Address | null;
  onClose: () => void;
  onSave: (form: {
    street: string;
    ward: string;
    province: string;
    phone: string;
    isDefault?: boolean;
  }) => void;
}

function AddressForm({ editing, onClose, onSave }: FormProps) {
  const [street, setStreet] = useState(editing?.street || "");
  const [ward, setWard] = useState(editing?.ward || "");
  const [province, setProvince] = useState(editing?.province || "");
  const [phone, setPhone] = useState(editing?.phone || "");
  const [isDefault, setIsDefault] = useState(editing?.isDefault || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ street, ward, province, phone, isDefault });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {editing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Số nhà / Đường"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Xã / Phường"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Tỉnh / Thành phố"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
            />
            Đặt làm mặc định
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editing ? "Cập nhật" : "Hoàn thành"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
