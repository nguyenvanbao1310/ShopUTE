import { FC } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addToCart } from "../store/cartSlice";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  thumbnailUrl?: string;
}

const ProductCard: FC<ProductCardProps> = ({ id, name, price, thumbnailUrl }) => {
  const dispatch = useDispatch<AppDispatch>();
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
      <button
        className="mt-2 w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
        onClick={() => dispatch(addToCart({ productId: id, quantity: 1 }))}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

