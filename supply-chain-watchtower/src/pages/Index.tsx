
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SupplyChainHero from "@/components/landing/SupplyChainHero";
import FeatureSection from "@/components/landing/FeatureSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {

      const userData = localStorage.getItem("SupplyChainUser");
      if (userData) {
        setIsLoggedIn(true);
      }
  }, []);
  

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleDemoClick = () => {
    toast({
      title: "Demo Access",
      description: "Experience our demo with username: demo@example.com, password: demo123",
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ width: "100vw", overflowX: "hidden" }}>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-supply-purple w-8 h-8 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
            <h1 className="text-xl font-bold text-supply-deeper-purple">Supply Chain Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
                <Button onClick={() => navigate("/register")}>Sign up</Button>
              </>
            ) : (
              <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <SupplyChainHero onGetStarted={handleGetStarted} onDemoClick={handleDemoClick} />
        <FeatureSection />
        <HowItWorks />
        <CallToAction onGetStarted={handleGetStarted} />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
