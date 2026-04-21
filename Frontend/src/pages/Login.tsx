import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useFranchise } from "@/contexts/FranchiseContext";
import { Loader2, Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const submitRef = useRef<HTMLButtonElement>(null);
  const { login } = useAuth();
  const { branding } = useFranchise();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!submitRef.current) return;
    const rect = submitRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    submitRef.current.style.setProperty('--mouse-x', `${x}%`);
    submitRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password, rememberMe);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const primaryColor = branding.primary_color || "#2d2f31";

  return (
    <div className="flex min-h-screen font-sans bg-white">
      {/* Left side Image Container */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-100">
        <img src="/landing_page/login.jpg" alt="Welcome to the Platform" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* Right side Form Container */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white relative">
        <div className="w-full max-w-[420px] mx-auto animate-in fade-in zoom-in-95 duration-500">
        
        {/* Back Link */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center text-xs font-bold text-text-muted hover:text-primary transition-colors tracking-widest uppercase"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </div>

        {/* Branding */}
        <div className="flex flex-col items-start mb-10">
          <Link to="/" className="flex flex-col items-start gap-4 hover:opacity-90 transition-opacity mb-4">
            {branding.logo_url ? (
              <img 
                src={getImageUrl(branding.logo_url)} 
                alt={`${branding.name} Logo`} 
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div 
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            )}
          </Link>
          <h1 className="headline-serif text-3xl font-bold text-zinc-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Securely access your professional workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Protocol</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-14 rounded-xl border border-zinc-200 bg-white px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-zinc-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Security Key</Label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-bold hover:underline transition-colors"
                style={{ color: primaryColor }}
              >
                Reset Access?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your security key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-12 h-14 rounded-xl border border-zinc-200 bg-white px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-zinc-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-full"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password row */}
          <div className="flex items-center justify-between">
            <label
              htmlFor="remember-me"
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="relative">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                {/* Custom checkbox track */}
                <div
                  className="w-9 h-5 rounded-full border transition-all duration-300 peer-checked:border-transparent"
                  style={{
                    backgroundColor: rememberMe ? primaryColor : 'transparent',
                    borderColor: rememberMe ? primaryColor : '#d1d5db',
                  }}
                >
                  {/* Thumb */}
                  <div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300"
                    style={{ transform: rememberMe ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted group-hover:text-text-main transition-colors">
                Remember Me
              </span>
            </label>
          </div>

          {/* Interactive Form Submit Button */}
          <button
            type="submit"
            ref={submitRef}
            onMouseMove={handleButtonMouseMove}
            disabled={isLoading}
            className="group relative w-full h-12 mt-2 rounded-xl overflow-hidden shadow-md flex items-center justify-center transition-transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed border border-white/10"
          >
            <div className="absolute inset-0 transition-colors" style={{ backgroundColor: primaryColor }}></div>
            <div 
              className="absolute inset-0 transition-opacity duration-300 pointer-events-none opacity-0 group-hover:opacity-40 mix-blend-overlay"
              style={{
                background: "radial-gradient(120px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.9), transparent 100%)"
              }}
            ></div>
            <span className="relative z-10 text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-sm font-medium text-zinc-500">
            New to the ecosystem?{" "}
            <Link 
              to="/signup" 
              className="font-bold hover:underline transition-colors ml-1"
              style={{ color: primaryColor }}
            >
              Initialize Profile
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
