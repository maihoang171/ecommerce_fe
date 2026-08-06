import React from "react";
import { Minus, Plus } from "lucide-react";

interface IQuantitySelectorProps {
  quantity: number;
  stockQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
}
export const ProductQuantitySelector = ({
  quantity,
  stockQuantity,
  onQuantityChange,
}: IQuantitySelectorProps) => {
  const handleMinus = () => {
    onQuantityChange(quantity - 1);
  };

  const handlePlus = () => {
    onQuantityChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);

    if (isNaN(val) || val < 1) {
      onQuantityChange(1);
    } else if (val > stockQuantity) {
      onQuantityChange(stockQuantity);
    } else {
      onQuantityChange(val);
    }
  };

  return (
    <div className="flex flex-rows gap-5 border rounded-2xl justify-center max-w-">
      <button
        onClick={handleMinus}
        disabled={quantity <= 1}
        className="hover:cursor-pointer disabled:text-gray-400"
        aria-label="minus-btn"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={stockQuantity}
        className="w-4 text-center text-sm  [&::-webkit-inner-spin-button]:appearance-none focus:outline-none"
        data-testid="quantity-input"
      />
      <button
        onClick={handlePlus}
        disabled={quantity >= stockQuantity}
        className="hover:cursor-pointer disabled:text-gray-400"
        aria-label="plus-btn"
      >
        <Plus className="w-4 h-4 " />
      </button>
    </div>
  );
};
