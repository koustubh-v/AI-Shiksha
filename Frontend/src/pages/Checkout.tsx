import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Lock, ShoppingBag, CheckCircle, Loader2, Tag, ArrowLeft } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "India", // Default
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Basic validation
    if (!formData.firstName || !formData.email || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      clearCart();
      toast.success("Payment successful! 🎉");
      navigate("/order-success");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-[#2d2f31]">
        <div className="w-24 h-24 bg-[#f7f9fa] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-[#2d2f31]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Cart is Empty</h2>
        <p className="text-[#6a6f73] mb-6">Please add some courses first.</p>
        <Link to="/courses">
          <button className="bg-[#a435f0] text-white font-bold py-3 px-8 hover:bg-[#8710d8] transition-colors">
            Browse Courses
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#2d2f31]">
      {/* Header */}
      <div className="border-b border-[#d1d7dc] sticky top-0 bg-white z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/cart" className="flex items-center gap-2 text-[#a435f0] hover:text-[#8710d8] font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#6a6f73]" />
            <span className="font-bold text-[#6a6f73] text-sm hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            {/* Billing Address */}
            <div>
              <h2 className="text-xl font-bold mb-4">Billing Address</h2>
              <form className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold pl-1 text-[#2d2f31]">First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border border-[#2d2f31] rounded-none p-3 outline-none focus:ring-1 focus:ring-[#2d2f31] text-sm"
                      type="text" required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold pl-1 text-[#2d2f31]">Last Name</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full border border-[#2d2f31] rounded-none p-3 outline-none focus:ring-1 focus:ring-[#2d2f31] text-sm"
                      type="text" required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold pl-1 text-[#2d2f31]">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-[#2d2f31] rounded-none p-3 outline-none focus:ring-1 focus:ring-[#2d2f31] text-sm"
                    type="email" required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold pl-1 text-[#2d2f31]">Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-[#2d2f31] rounded-none p-3 outline-none focus:ring-1 focus:ring-[#2d2f31] text-sm"
                    type="text" required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold pl-1 text-[#2d2f31]">City</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-[#2d2f31] rounded-none p-3 outline-none focus:ring-1 focus:ring-[#2d2f31] text-sm"
                      type="text" required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold pl-1 text-[#2d2f31]">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border border-[#2d2f31] rounded-none p-3 outline-none focus:ring-1 focus:ring-[#2d2f31] bg-white text-sm"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="border border-[#d1d7dc] rounded-sm overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-[#d1d7dc] bg-[#f7f9fa]">
                  <input
                    type="radio"
                    name="payment"
                    id="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="w-4 h-4 text-[#2d2f31] focus:ring-[#2d2f31] accent-[#2d2f31]"
                  />
                  <label htmlFor="card" className="flex items-center gap-2 font-bold cursor-pointer text-sm">
                    <CreditCard className="w-5 h-5" /> Credit/Debit Card
                  </label>
                </div>
                {paymentMethod === "card" && (
                  <div className="p-6 bg-white space-y-4">
                    <input type="text" placeholder="Name on Card" className="w-full border border-[#d1d7dc] p-3 rounded-none outline-none text-sm placeholder-gray-500" />
                    <input type="text" placeholder="Card Number" className="w-full border border-[#d1d7dc] p-3 rounded-none outline-none text-sm placeholder-gray-500" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="w-full border border-[#d1d7dc] p-3 rounded-none outline-none text-sm placeholder-gray-500" />
                      <input type="text" placeholder="CVC" className="w-full border border-[#d1d7dc] p-3 rounded-none outline-none text-sm placeholder-gray-500" />
                    </div>
                  </div>
                )}
                <div className="p-4 flex items-center gap-3 bg-[#f7f9fa] border-t border-[#d1d7dc]">
                  <input
                    type="radio"
                    name="payment"
                    id="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="w-4 h-4 text-[#2d2f31] focus:ring-[#2d2f31] accent-[#2d2f31]"
                  />
                  <label htmlFor="upi" className="flex items-center gap-2 font-bold cursor-pointer text-sm">
                    <span>UPI / NetBanking</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4">
                  <img src={item.course.thumbnail_url} alt="" className="w-16 h-16 object-cover bg-gray-100 border border-[#d1d7dc]" />
                  <div>
                    <h4 className="font-bold text-sm line-clamp-2">{item.course.title}</h4>
                    <p className="text-xs text-[#6a6f73]">₹{item.course.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="bg-[#f7f9fa] p-6 border border-[#d1d7dc] sticky top-24">
              <h2 className="text-xl font-bold mb-6">Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#2d2f31] text-sm">
                  <span className="font-bold">Original Price:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#2d2f31] text-sm">
                  <span className="font-bold">Discounts:</span>
                  <span>-₹0</span>
                </div>
                <div className="h-px bg-[#d1d7dc] my-2"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-xs text-[#6a6f73] mb-6 text-center px-4">
                By completing your purchase you agree to these <a href="#" className="underline text-[#a435f0]">Terms of Service</a>.
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-3 bg-[#a435f0] text-white font-bold text-md hover:bg-[#8710d8] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  "Complete Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
