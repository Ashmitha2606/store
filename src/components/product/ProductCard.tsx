import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { Product } from '../../services/supabase';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/cartSlice';
import Button from '../ui/Button';
import { productPlaceholder } from '../../utils/fallbackImages';

interface ProductCardProps {
  product: Product;
}

type WeightOption =  '250g' | '500g' | '1kg' | '2kg';

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>('250g');
  const [quantity, setQuantity] = useState(1);

  // Get available weight options
  const weightOptions = [
    
    { weight: '250g' as WeightOption, price: product.price_250g },
    { weight: '500g' as WeightOption, price: product.price_500g },
    { weight: '1kg' as WeightOption, price: product.price_1kg },
    { weight: '2kg' as WeightOption, price: product.price_2kg },
  ].filter((option): option is { weight: WeightOption; price: number } => option.price !== null);

  // Get current price based on selected weight
  const getCurrentPrice = () => {
    const option = weightOptions.find((opt) => opt.weight === selectedWeight);
    return option ? option.price : 0;
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        weight: selectedWeight,
        quantity,
      })
    );
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden h-48 bg-green-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = productPlaceholder;
          }}
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase">{product.category}</span>
          <Link to={`/products/${product.id}`} className="block mt-1">
            <h3 className="text-lg font-medium text-gray-900 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Weight Selection */}
        <div className="mb-4 mt-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            {weightOptions.map((option) => (
              <button
                key={option.weight}
                className={`px-2 py-1 text-xs rounded border ${
                  selectedWeight === option.weight
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
                onClick={() => setSelectedWeight(option.weight)}
              >
                {option.weight} - ₹{option.price.toFixed(2)}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-md">
              <button
                className="px-2 py-1 bg-white border border-gray-300 text-green-600 hover:bg-gray-100 hover:border-primary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-2 py-1 min-w-[2rem] text-center">{quantity}</span>
              <button
                className="px-2 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-primary"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              ₹{((getCurrentPrice() || 0) * quantity).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          fullWidth
          className="mt-2"
        >
          <FaShoppingCart className="mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
