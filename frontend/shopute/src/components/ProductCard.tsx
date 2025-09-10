import { FC } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  thumbnailUrl?: string;
}

const ProductCard: FC<ProductCardProps> = ({ name, price, thumbnailUrl }) => {
  const formatPrice = (value: number) => {
    return value.toLocaleString("vi-VN") + " VNĐ";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300  cursor-pointer">
      <img
        src={thumbnailUrl || "/placeholder.png"}
        alt={name}
        className="w-full h-40 object-contain rounded"
      />
      <h3 className="mt-2 font-semibold text-gray-800">{name}</h3>
      <p className="text-pink-600 font-bold">{formatPrice(Number(price))}</p>
      <button className="mt-2 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
