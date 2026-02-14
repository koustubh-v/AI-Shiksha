import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Loader2,
  ArrowLeft
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { items, total, removeFromCart, loading } = useCart();

  const handleRemoveItem = async (courseId: string) => {
    await removeFromCart(courseId);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#a435f0] animate-spin mx-auto mb-4" />
          <p className="text-[#6a6f73]">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#2d2f31]">
      {/* Header */}
      <div className="border-b border-[#d1d7dc] sticky top-0 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#2d2f31]">Shopping Cart</h1>
            <span className="text-[#6a6f73] font-bold text-sm bg-[#f7f9fa] px-2 py-1 rounded-sm">
              {items.length} {items.length === 1 ? "Course" : "Courses"}
            </span>
          </div>
          <button
            onClick={() => navigate("/courses")}
            className="text-[#a435f0] font-bold text-sm hover:text-[#8710d8]"
          >
            Keep Shopping
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="border border-[#d1d7dc] rounded-sm p-12 text-center bg-white shadow-sm max-w-2xl mx-auto mt-8">
            <div className="w-24 h-24 bg-[#f7f9fa] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#d1d7dc]">
              <ShoppingBag className="w-10 h-10 text-[#2d2f31]" />
            </div>
            <p className="text-[#2d2f31] mb-6 text-lg font-bold">
              Your cart is empty. Keep shopping to find a course!
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-[#2d2f31] text-white font-bold py-3 px-8 hover:bg-black transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-0">
              <p className="text-sm font-bold text-[#6a6f73] mb-2">{items.length} Course in Cart</p>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 py-4 border-t border-[#d1d7dc]"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-32 h-20 bg-gray-100 overflow-hidden border border-[#d1d7dc]">
                    {item.course.thumbnail_url ? (
                      <img
                        src={item.course.thumbnail_url}
                        alt={item.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-[#2d2f31] line-clamp-2 leading-tight text-base">
                          {item.course.title}
                        </h3>
                        <button
                          onClick={() => handleRemoveItem(item.course.id)}
                          className="text-[#a435f0] text-sm font-bold hover:text-[#8710d8] hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                      {item.course.instructor && (
                        <p className="text-xs text-[#6a6f73] mt-1">
                          By {item.course.instructor.user.name}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-[#eceb98] px-1.5 py-0.5 text-xs font-bold text-[#3d3c0a]">Bestseller</div>
                        <div className="text-xs text-[#6a6f73]">4.5 ⭐</div>
                      </div>
                    </div>

                    <div className="mt-2 text-right sm:text-left sm:absolute sm:right-0 sm:mt-0">
                      {/* Note: Absolute positioning logic above is just a placeholder, simplifying for flex layout */}
                    </div>
                  </div>
                  <div className="text-right">
                    {item.course.price > 0 ? (
                      <span className="font-bold text-[#a435f0] text-lg">
                        ₹{item.course.price.toLocaleString()}
                      </span>
                    ) : (
                      <span className="font-bold text-green-700 text-lg">Free</span>
                    )}
                    <p className="text-xs text-[#6a6f73] line-through">₹{(item.course.price * 2).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <p className="text-[#6a6f73] font-bold text-lg">Total:</p>
                <h2 className="text-4xl font-bold text-[#2d2f31]">₹{total.toLocaleString()}</h2>
                <p className="text-sm text-[#6a6f73] line-through">₹{(total * 2).toLocaleString()}</p>
                <p className="text-sm text-[#2d2f31]">83% off</p>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#a435f0] text-white font-bold py-3.5 hover:bg-[#8710d8] transition-colors"
                >
                  Checkout
                </button>

                <div className="pt-4 border-t border-[#d1d7dc] space-y-2">
                  <p className="text-sm font-bold text-[#2d2f31]">Promotions</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon"
                      className="flex-1 border border-[#2d2f31] px-3 py-2 text-sm outline-none placeholder-gray-500"
                    />
                    <button className="bg-[#a435f0] text-white font-bold px-4 py-2 hover:bg-[#8710d8] transition-colors text-sm">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
