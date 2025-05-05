import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  Check,
  MapPin,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Sample data for analytics
const monthlyData = [
  { name: "Jan", products: 65, shipments: 45, onTime: 42, delayed: 3 },
  { name: "Feb", products: 78, shipments: 52, onTime: 50, delayed: 2 },
  { name: "Mar", products: 82, shipments: 60, onTime: 56, delayed: 4 },
  { name: "Apr", products: 70, shipments: 50, onTime: 47, delayed: 3 },
  { name: "May", products: 85, shipments: 65, onTime: 62, delayed: 3 }
];

const statusData = [
  { name: "Manufactured", value: 35 },
  { name: "Shipped", value: 25 },
  { name: "In Transit", value: 28 },
  { name: "Delivered", value: 40 },
  { name: "Delayed", value: 3 }
];

const originData = [
  { name: "Colombia", value: 22 },
  { name: "Indonesia", value: 18 },
  { name: "France", value: 15 },
  { name: "India", value: 20 },
  { name: "Thailand", value: 12 },
  { name: "Others", value: 13 }
];

const COLORS = ["#9b87f5", "#7E69AB", "#1A1F2C", "#1EAEDB", "#FF7171", "#8E9196"];

const Analytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("SupplyChainToken");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access analytics",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
    
    // Handle window resize for responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, toast]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Function to handle downloading analytics data
  const handleDownloadReport = () => {
    toast({
      title: "Download Initiated",
      description: "Your analytics report is being prepared for download",
    });
  };

  if (loading || !isAuthenticated) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar (hidden on mobile when collapsed) */}
        <div className={`${sidebarCollapsed ? "hidden md:block md:w-16" : ""} transition-all duration-300 flex-shrink-0`}>
          <DashboardSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardHeader onMenuClick={toggleSidebar} title="Analytics" />

          {/* Analytics Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="w-full md:w-auto flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-supply-purple" />
                <h1 className="text-2xl font-bold">Supply Chain Analytics</h1>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleDownloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Main Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-supply-purple" />
                    <div className="text-2xl font-bold">128</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-supply-purple" />
                    <div className="text-2xl font-bold">65</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <div className="text-2xl font-bold">95%</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">+2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transit Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-supply-blue" />
                    <div className="text-2xl font-bold">8.2 days</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">-0.5 days from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Activity</CardTitle>
                  <CardDescription>Monthly product and shipment tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="products" fill="#9b87f5" name="Products" />
                        <Bar dataKey="shipments" fill="#7E69AB" name="Shipments" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Performance</CardTitle>
                  <CardDescription>On-time vs delayed deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="onTime" 
                          stroke="#10B981" 
                          strokeWidth={2} 
                          name="On Time" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="delayed" 
                          stroke="#EF4444" 
                          strokeWidth={2} 
                          name="Delayed" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status Distribution</CardTitle>
                  <CardDescription>Current status of all products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} products`, 'Quantity']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Origin</CardTitle>
                  <CardDescription>Distribution by country of origin</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={originData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {originData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} products`, 'Quantity']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Insights & Recommendations</CardTitle>
                <CardDescription>AI-powered supply chain optimization suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 p-4 border rounded-md">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">On-Time Delivery Improvement</h3>
                      <p className="text-sm text-muted-foreground">
                        Your on-time delivery rate has improved by 2% compared to last month, 
                        indicating that your logistics optimizations are working effectively.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border rounded-md">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Potential Shipping Delays</h3>
                      <p className="text-sm text-muted-foreground">
                        Analysis shows potential delays in upcoming Indonesian shipments due to reported port congestion. 
                        Consider alternative routes or expedited shipping.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 border rounded-md">
                    <MapPin className="h-5 w-5 text-supply-purple flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium mb-1">Distribution Center Suggestion</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on delivery patterns, adding a distribution center in Toronto could 
                        reduce average delivery times by 1.5 days for North American shipments.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
