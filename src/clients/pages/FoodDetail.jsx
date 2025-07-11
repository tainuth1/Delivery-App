import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Clock,
  Minus,
  Plus,
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useCart } from "../contexts/CartContext";
import { useFood } from "../contexts/FoodContext";
import { FoodCard } from "../components/FoodCard";
import { useVendor } from "../contexts/VendorContext";
import { useAuth } from "../../contexts/AuthContext";

export const FoodDetail = () => {
  const { foodId } = useParams();
  const { vendor, loading: vendorLoading, getVendorById } = useVendor();
  const { food, loading, error, getFoodById } = useFood();
  const [quantity, setQuantity] = useState(1);
  const { addItem, state } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (foodId) {
      getFoodById(foodId);
    }
  }, [foodId]);

  useEffect(() => {
    if (food?.vendor?.id) {
      getVendorById(food.vendor.id);
    }
  }, [food]);

  if (loading || vendorLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Food item not found
          </h2>
          <Link
            to="/explore"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem(food);
    }
    setQuantity(1);
  };

  const isInCart = state.items.some((item) => item.id === food.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/explore"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Image */}
          <div className="relative">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-full shadow-md">
                <Heart className="w-5 h-5" />
              </button>
              <button className="bg-white hover:bg-gray-100 text-gray-600 p-2 rounded-full shadow-md">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            {food.tags?.includes("premium") && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Premium
              </div>
            )}
          </div>

          {/* Food Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {food.name}
              </h1>
              <p className="text-gray-600 text-lg">{food.description}</p>
              <div className="flex item-center my-4">
                <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                  {food.category}
                </span>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{food.rating}</span>
                <span className="text-gray-600">({205} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{food.ready_time} min</span>
              </div>
            </div>

            {/* Vendor */}
            <div className="mb-6">
              <Link
                to={`/vendor/${food.vendor.id}`}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
              >
                <img
                  src={food.vendor.image}
                  alt={food.vendor.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {food.vendor.name}
              </Link>
            </div>

            {/* Price and Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-orange-600">
                  ${food.price}
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-lg w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 font-bold" />
                Add to Cart - ${(food.price * quantity).toFixed(2)}
              </button>
              {isInCart && (
                <p className="text-green-600 text-sm mt-2 text-center">
                  ✓ This item is already in your cart
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Foods in this Restaurant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendor ? (
            vendor?.foods?.map((food) => (
              <FoodCard key={food.id} food={food} showVendor={false} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              <p>No food in this vendor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
