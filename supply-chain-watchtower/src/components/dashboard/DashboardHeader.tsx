
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Search, 
  Menu
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title: string;
}

const DashboardHeader = ({ onMenuClick, title }: DashboardHeaderProps) => {
  const navigate = useNavigate();
    const { user, logout } = useAuth();

  useEffect(() => {
    console.log("User:", user);
    console.log("User Name:", user.name);
    const storedUser = localStorage.getItem("SupplyChainUser");
    console.log("Stored User:", storedUser);

  }, []);

  return (
    <header className="border-b border-border h-14 px-4 flex items-center justify-between bg-background" >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search..." 
            className="pl-8 w-full bg-muted/30" 
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-supply-purple rounded-full"></span>
        </Button>
        
        <div 
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <span className="font-medium text-gray-700">
            {user.name?.[0]?.toUpperCase() || ""}
            
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
