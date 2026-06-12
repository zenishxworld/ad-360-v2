import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginWithGoogle, isLoading } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F8FA] to-[#E8F0F6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-12 text-center">
            <h1 className="text-3xl font-bold text-[#2C3539] mb-3">Welcome Back</h1>
            <p className="text-muted-foreground mb-10">
              Sign in to continue your university journey with UNI360.
            </p>

            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-[#E08D3C] hover:bg-[#c97a2e] text-white h-14 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition-all"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>
            
            <p className="text-xs text-muted-foreground mt-8">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
