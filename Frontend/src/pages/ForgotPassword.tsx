import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFranchise } from "@/contexts/FranchiseContext";
import { ArrowLeft, Loader2, GraduationCap, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/utils";
import api from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { branding } = useFranchise();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast({
        title: "Check your email",
        description: "If an account exists, a reset link has been sent.",
      });
    } catch (error) {
       // We usually don't want to expose if an email exists or not to prevent scrubbing,
       // but we'll show a generic error if the network fails.
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
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
        
        {/* Back Link */}
        <div className="mb-6 -mt-2">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign in
          </Link>
        </div>

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
              Reset Password
            </h1>
          </Link>
          {!submitted && (
            <p className="mt-3 text-sm text-gray-500 text-center">
              Enter your email and we'll send you a link to reset your password.
            </p>
          )}
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 rounded-xl border-gray-300 bg-gray-50/50 px-4 focus:bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-4 text-white font-bold text-base rounded-xl transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.98] shadow-md border-0"
              style={{ backgroundColor: primaryColor }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Check your inbox</h2>
              <p className="text-gray-500 mb-8 text-sm">
                We've sent a password reset link to <br/>
                <span className="font-semibold text-gray-700">{email}</span>
              </p>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="w-full h-12 rounded-xl border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Try another email
              </Button>
          </div>
        )}
      </div>
    </div>
  );
}
