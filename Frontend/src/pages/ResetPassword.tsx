import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFranchise } from "@/contexts/FranchiseContext";
import { ArrowLeft, Loader2, GraduationCap, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";
import api from "@/lib/api";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const { branding } = useFranchise();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Link",
        description: "The password reset link is invalid or missing.",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords mismatch",
        description: "Your passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/reset-password", { token, password });
      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.response?.data?.message || "Something went wrong. The link may have expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = branding.primary_color || "#2d2f31";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fa] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="flex flex-col items-center gap-4 hover:opacity-90 transition-opacity">
            {branding.logo_url ? (
              <img 
                src={getImageUrl(branding.logo_url)} 
                alt={`${branding.name} Logo`} 
                className="h-14 w-auto object-contain"
              />
            ) : (
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-xl shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center">
              Create New Password
            </h1>
          </Link>
          <p className="mt-3 text-sm text-gray-500 text-center">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12 h-12 rounded-xl border-gray-300 bg-gray-50/50 px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-12 h-12 rounded-xl border-gray-300 bg-gray-50/50 px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-4 text-white font-bold text-base rounded-xl transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] shadow-md border-0"
              style={{ backgroundColor: primaryColor }}
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
