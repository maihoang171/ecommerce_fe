import type { IProduct } from "@/features/product/services/product";

export interface CartToastProps {
  product: IProduct;
  color: string;
  size: string;
  quantity: number
}
export const CartToast = ({ product, color, size, quantity }: CartToastProps) => {
  if (!product || !color || !size) return;

  return (
    <div className="flex bg-white border border-gray-100 items-center gap-4 p-2">
      <img
        src={product.images[0].imageUrl}
        className="w-20 h-25 object-cover rounded"
      />
      <div className="ml-4">
        <div className="font-bold">{product.name}</div>
        {product.discountPrice ? (
          <div className="flex flex-row gap-4">
            <div className="text-red-400">${product.discountPrice}</div>
            <div className="line-through">${product.price}</div>
          </div>
        ) : (
          <div>{product.price}</div>
        )}
        <p>Color: {color}</p>
        <p>Size: {size}</p>
        <p>Quantity: {quantity}</p>
        
        <p className="text-green-400 font-bold">Added to cart successfully</p>
      </div>
    </div>
  );
};
