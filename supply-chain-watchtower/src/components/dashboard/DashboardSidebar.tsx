import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Package, 
  Truck, 
  BarChart3, 
  QrCode, 
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const DashboardSidebar = ({ collapsed = false, onToggle }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, refreshAuthState } = useAuth();

  // Debug - Log authentication state on mount and when location changes
  useEffect(() => {
    // Check localStorage directly
    const token = localStorage.getItem("SupplyChainToken");
    const storedUser = localStorage.getItem("SupplyChainUser");
    
    console.log("Sidebar auth state:", { 
      isAuthenticated, 
      hasToken: !!token, 
      user, 
      path: location.pathname 
    });
    
    // This ensures we're always using the latest auth state
    refreshAuthState?.();
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Products",
      icon: Package,
      href: "/products",
    },
    {
      title: "Shipments",
      icon: Truck,
      href: "/shipments",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics",
    },
    {
      title: "QR Generator",
      icon: QrCode,
      href: "/qr-generator",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  // Modified navigation handler
  const handleNavigation = (path: string) => {
    // Check authentication state directly from localStorage
    const token = localStorage.getItem("SupplyChainToken");
    
    if (token) {
      // If we have a token, navigate directly to the path
      navigate(path);
    } else {
      // If no token, redirect to login with return URL
      navigate(`/login?returnUrl=${encodeURIComponent(path)}`);
    }
  };

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="h-14 flex items-center px-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-supply-purple w-8 h-8 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">SC</span>
          </div>
          {!collapsed && <Link to='/'><span className="font-bold">Supply Chain</span></Link> }
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton 
                className={cn(
                  "flex items-center space-x-2", 
                  location.pathname === item.href && "bg-muted"
                )}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.title}</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex flex-col space-y-4">
          {!collapsed && user && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-gray-700">
                  {user.name?.[0]?.toUpperCase() || ""}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </div>
          )}
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;