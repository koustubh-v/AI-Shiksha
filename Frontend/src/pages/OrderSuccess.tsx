import { Link } from "react-router-dom";
import { CheckCircle, BookOpen, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-[#2d2f31]">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-[#6a6f73] mb-8 text-lg">
          Thank you for your purchase. You are now enrolled in your new courses.
        </p>

        <div className="space-y-4">
          <Link to="/my-courses">
            <button className="w-full bg-[#2d2f31] text-white font-bold py-3.5 px-6 hover:bg-black transition-colors flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              Go to My Learning
            </button>
          </Link>

          <Link to="/courses">
            <button className="w-full bg-white border border-[#2d2f31] text-[#2d2f31] font-bold py-3.5 px-6 hover:bg-[#f7f9fa] transition-colors flex items-center justify-center gap-2">
              Browse More Courses
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
