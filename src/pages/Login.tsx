
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      // Error is handled in the login function
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login credentials for different roles
  const handleDemoLogin = async (role: string) => {
    setIsLoading(true);
    let email = '';
    
    switch(role) {
      case 'admin':
        email = 'admin@example.com';
        break;
      case 'doctor':
        email = 'doctor@example.com';
        break;
      case 'patient':
        email = 'patient@example.com';
        break;
      default:
        email = 'admin@example.com';
    }
    
    try {
      await login(email, 'password');
    } catch (err) {
      toast({
        title: "Demo Login Failed",
        description: `Failed to log in as ${role}. Please make sure the user exists.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-medblue/10 to-medgreen/10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-medblue" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">MedFlow Center</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the health center management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-medblue hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-medblue hover:bg-medblue/90" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500 mb-2">Demo Logins</div>
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleDemoLogin('admin')}
              disabled={isLoading}
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleDemoLogin('doctor')}
              disabled={isLoading}
            >
              Doctor
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleDemoLogin('patient')}
              disabled={isLoading}
            >
              Patient
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
