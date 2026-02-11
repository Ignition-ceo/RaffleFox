import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import logoOrange from "@/assets/raffle-fox-logo-orange.png";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Dev bypass via URL param ?dev=1
const getDevBypass = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("dev") === "1";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user, authDisabled } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const devBypass = getDevBypass();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Redirect if auth is disabled, dev bypass, or already authenticated
  if (authDisabled || devBypass || user) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate inputs
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        let errorMessage = error.message;
        
        // Handle common Firebase auth errors
        if (error.message.includes("auth/user-not-found")) {
          errorMessage = "No account found with this email.";
        } else if (error.message.includes("auth/wrong-password")) {
          errorMessage = "Incorrect password.";
        } else if (error.message.includes("auth/email-already-in-use")) {
          errorMessage = "An account with this email already exists.";
        } else if (error.message.includes("auth/weak-password")) {
          errorMessage = "Password is too weak. Please use a stronger password.";
        } else if (error.message.includes("auth/invalid-credential")) {
          errorMessage = "Invalid email or password.";
        }

        toast({
          variant: "destructive",
          title: isLogin ? "Sign in failed" : "Sign up failed",
          description: errorMessage,
        });
      } else {
        toast({
          title: isLogin ? "Welcome back!" : "Account created!",
          description: isLogin
            ? "You have been signed in successfully."
            : "Your account has been created. Please contact an admin to grant you access.",
        });
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoOrange} 
              alt="Raffle Fox" 
              className="h-10 object-contain"
            />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Sign in" : "Create account"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Raffle Fox Admin Dashboard"
              : "Create a new admin account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Use your admin email and password
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
