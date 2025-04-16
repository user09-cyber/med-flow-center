
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to dashboard or login
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-medblue/10 to-medgreen/10">
      <div className="text-center space-y-6 max-w-3xl px-4">
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-lg">
            <ShieldCheck className="h-20 w-20 text-medblue" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Welcome to MedFlow Center</h1>
        
        <p className="text-xl text-gray-600">
          A comprehensive health center management system for efficiently managing appointments, 
          medical records, staff, and more.
        </p>
        
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-medblue hover:bg-medblue/90 text-lg px-6 py-6 h-auto"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="text-lg px-6 py-6 h-auto"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
