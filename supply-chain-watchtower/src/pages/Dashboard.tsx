import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import { Package, Truck, Check, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";

// Sample data for the dashboard
const productData = [
  { id: "SC-928742", name: "Organic Coffee Beans", status: "In Transit", progress: 65 },
  { id: "SC-928743", name: "Bamboo Toothbrushes", status: "Delivered", progress: 100 },
  { id: "SC-928744", name: "Recycled Paper Notebooks", status: "Manufactured", progress: 30 },
  { id: "SC-928745", name: "Eco-friendly Soap", status: "Shipped", progress: 50 },
];

const statusColors = {
  "Manufactured": "bg-blue-500",
  "Shipped": "bg-yellow-500",
  "In Transit": "bg-purple-500",
  "Delivered": "bg-green-500",
  "Delayed": "bg-red-500"
};

const chartData = [
  { name: "Jan", products: 65, shipments: 45 },
  { name: "Feb", products: 78, shipments: 52 },
  { name: "Mar", products: 82, shipments: 60 },
  { name: "Apr", products: 70, shipments: 50 },
  { name: "May", products: 85, shipments: 65 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    // We'll let the App.tsx handle redirection via protected routes
    return null;
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
          <DashboardHeader onMenuClick={toggleSidebar} title="Dashboard" />

          {/* Dashboard Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-supply-purple" />
                    <div className="text-2xl font-bold">128</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-5 w-5 text-supply-purple" />
                    <div className="text-2xl font-bold">42</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">5 arriving today</p>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Delayed Shipments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">-2 from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Supply Chain Activity</CardTitle>
                  <CardDescription>Monthly product and shipment tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
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
                        <RechartsTooltip />
                        <Bar dataKey="products" fill="#9b87f5" name="Products" />
                        <Bar dataKey="shipments" fill="#7E69AB" name="Shipments" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest supply chain events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "10:24 AM", text: "Shipment SC-928742 reached checkpoint", type: "info" },
                      { time: "Yesterday", text: "New product batch registered", type: "success" },
                      { time: "Yesterday", text: "Quality control inspection passed", type: "success" },
                      { time: "2 days ago", text: "Delayed shipment notification", type: "warning" },
                      { time: "3 days ago", text: "Inventory restocked", type: "info" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start">
                        <div className={`mt-1 w-2 h-2 rounded-full ${item.type === 'info' ? 'bg-blue-500' : item.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div className="ml-3">
                          <p className="text-sm font-medium">{item.text}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Products</CardTitle>
                  <CardDescription>Monitor your latest product shipments</CardDescription>
                </div>
                <Button onClick={() => navigate("/products")} variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productData.map((product) => (
                    <div key={product.id} className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="mr-2">{product.id}</span>
                            <span className={`inline-block w-2 h-2 rounded-full ${(statusColors as any)[product.status]}`} />
                            <span className="ml-1">{product.status}</span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          Details
                        </Button>
                      </div>
                      <Progress value={product.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
