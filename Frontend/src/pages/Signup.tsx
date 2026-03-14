import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Eye, EyeOff, BookOpen, Loader2, ArrowLeft } from "lucide-react";
import { cn, getImageUrl } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useFranchise } from "@/contexts/FranchiseContext";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup } = useAuth();
  const { branding } = useFranchise();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signup(formData.email, formData.password, formData.name, role);
      if (success) {
        toast({
          title: "Account created!",
          description: "You have successfully signed up and logged in.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Signup failed",
          description: "Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Something went wrong. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = branding.primary_color || "#2d2f31";
  
  // Adjusted distinct color for teacher selection logic to use branding if possible, 
  // or default to a distinct secondary color for clarity.
  const roleColors = {
    student: primaryColor,
    teacher: "#8b5cf6" // A subtle purple to separate the 'teacher' role selection visually
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fa] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-300 border border-gray-100">
        
        {/* Back Link */}
        <div className="mb-6 -mt-2">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
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
              Join {branding.lms_name}
            </h1>
          </Link>
          <p className="mt-3 text-sm text-gray-500 text-center">
            Create an account to start your learning journey.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3 mb-8">
          <Label className="text-sm font-semibold text-gray-700">I want to</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 border-2 p-4 rounded-xl transition-all cursor-pointer",
                role === "student" ? "bg-opacity-10 shadow-sm shadow-current/10" : "border-gray-200 hover:border-gray-300 bg-white"
              )}
              style={role === "student" ? { 
                borderColor: roleColors.student, 
                backgroundColor: `${roleColors.student}15` 
              } : {}}
            >
              <GraduationCap 
                className="h-6 w-6" 
                style={{ color: role === "student" ? roleColors.student : "#9ca3af" }} 
              />
              <span className="font-semibold" style={{ color: role === "student" ? roleColors.student : "#374151" }}>
                Learn
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={cn(
                "flex flex-col items-center justify-center gap-2 border-2 p-4 rounded-xl transition-all cursor-pointer",
                role === "teacher" ? "bg-opacity-10 shadow-sm shadow-current/10" : "border-gray-200 hover:border-gray-300 bg-white"
              )}
              style={role === "teacher" ? { 
                borderColor: roleColors.teacher, 
                backgroundColor: `${roleColors.teacher}15` 
              } : {}}
            >
              <BookOpen 
                className="h-6 w-6" 
                style={{ color: role === "teacher" ? roleColors.teacher : "#9ca3af" }} 
              />
              <span className="font-semibold" style={{ color: role === "teacher" ? roleColors.teacher : "#374151" }}>
                Teach
              </span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded-xl border-gray-300 bg-gray-50/50 px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': roleColors[role] } as React.CSSProperties}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 rounded-xl border-gray-300 bg-gray-50/50 px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
              style={{ '--tw-ring-color': roleColors[role] } as React.CSSProperties}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-12 h-12 rounded-xl border-gray-300 bg-gray-50/50 px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': roleColors[role] } as React.CSSProperties}
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
            <p className="text-xs text-gray-500 mt-2 font-medium">Must be at least 8 characters</p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-6 text-white font-bold text-base rounded-xl transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] shadow-md border-0"
            style={{ backgroundColor: roleColors[role] }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-gray-100 space-y-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-bold hover:underline transition-colors ml-1"
              style={{ color: primaryColor }}
            >
              Log in
            </Link>
          </p>
          <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-[280px] mx-auto">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-gray-600 transition-colors">Terms of Service</Link> and{" "}
            <Link to="/privacy" className="underline hover:text-gray-600 transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
