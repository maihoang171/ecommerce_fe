interface PriceDisplayProps {
  discountPrice?: number | null;
  price: number;
}

export const PriceDisplay = ({ discountPrice, price }: PriceDisplayProps) => {
  if (discountPrice) {
    return (
      <div className="flex flex-row gap-5">
        <div className="text-red-500" data-testid="discount-price">
          ${discountPrice}
        </div>
        <div className="line-through">${price}</div>
      </div>
    );
  }

  return (
    <div>
      <div data-testid="original-price">${price}</div>
    </div>
  );
};
