import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "../api"; // assuming you've placed it there

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuthState: () => void; // New function to refresh auth state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // New function to manually refresh the auth state
  const refreshAuthState = () => {
    const token = localStorage.getItem("SupplyChainToken");
    const storedUser = localStorage.getItem("SupplyChainUser");

    console.log("Refreshing auth state:", { hasToken: !!token, hasUser: !!storedUser });

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("SupplyChainToken");
        localStorage.removeItem("SupplyChainUser");
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      refreshAuthState();
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });

      // You can adjust the keys returned by your backend
      const { token, user } = data;

      localStorage.setItem("SupplyChainToken", token);
      localStorage.setItem("SupplyChainUser", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast({
        title: "Login Successful",
        description: `Welcome, ${user.name}!`,
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });

      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("SupplyChainToken");
    localStorage.removeItem("SupplyChainUser");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};