import { useState, useEffect } from "react";
import { userApi  } from "../../apis/user";
const defaultAvatar = "/logo192.png"; // Ảnh avatar mặc định
const Account = () => {
  const [firstname, setFirstname] = useState("Nguyễn");
  const [lastname, setLastname] = useState("Văn A");
  const [phone, setPhone] = useState("0123456789");
  const [email, setEmail] = useState("vana@example.com");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  // Preview ảnh khi chọn file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };
   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getProfile();
        setFirstname(data.firstName);
        setLastname(data.lastName);
        setPhone(data.phone);
        setEmail(data.email);
      } catch (err) {
        console.error("Lỗi khi lấy profile:", err);
      } 
    };
    fetchProfile();
  }, []);

   const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await userApi.updateProfile({
        firstName: firstname,
        lastName: lastname,
        phone,
        // nếu API hỗ trợ
      });
      console.log("Profile đã cập nhật:", updatedProfile);
      alert("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
      alert("Cập nhật thất bại!");
    }
  };
  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl border border-green-100">
        <h2 className="text-xl text-green-600 font-bold mb-8 text-center">
          THÔNG TIN TÀI KHOẢN
        </h2>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <img
            className="rounded-full h-32 w-32 object-cover border-4 border-green-300 shadow"
            src={avatar || defaultAvatar}
            alt="Avatar"
          />
          {isEditing && (
            <label className="mt-4 cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition">
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600">Họ</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Tên</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-300"
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Nút hành động */}
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
            >
              Thay đổi thông tin
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
              >
                Cập nhật
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Account;
