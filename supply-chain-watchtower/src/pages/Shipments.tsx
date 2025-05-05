import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Truck, Filter, Search, Plus } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

// Sample shipment data
const shipmentData = [
  {
    id: "SH-10045",
    productId: "SC-928742",
    productName: "Organic Coffee Beans",
    origin: "Colombia",
    destination: "United States",
    status: "In Transit",
    carrier: "OceanFreight Ltd",
    estimatedDelivery: "2025-05-15",
    trackingNumber: "OF-98765432"
  },
  {
    id: "SH-10046",
    productId: "SC-928745",
    productName: "Eco-friendly Soap",
    origin: "France",
    destination: "Japan",
    status: "Shipped",
    carrier: "AirCargo Express",
    estimatedDelivery: "2025-05-12",
    trackingNumber: "ACE-12349876"
  },
  {
    id: "SH-10047",
    productId: "SC-928746",
    productName: "Organic Cotton T-shirts",
    origin: "India",
    destination: "Australia",
    status: "In Transit",
    carrier: "SeaRoute Shipping",
    estimatedDelivery: "2025-05-20",
    trackingNumber: "SRS-56781234"
  },
  {
    id: "SH-10048",
    productId: "SC-928743",
    productName: "Bamboo Toothbrushes",
    origin: "Indonesia",
    destination: "Canada",
    status: "Delivered",
    carrier: "Global Logistics",
    estimatedDelivery: "2025-04-29",
    trackingNumber: "GL-87651234"
  },
  {
    id: "SH-10049",
    productId: "SC-928748",
    productName: "Reusable Water Bottles",
    origin: "Thailand",
    destination: "South Korea",
    status: "Processing",
    carrier: "AsiaExpress",
    estimatedDelivery: "2025-05-18",
    trackingNumber: "AE-45678912"
  }
];

const statusColors = {
  "Processing": "bg-blue-500",
  "Shipped": "bg-yellow-500",
  "In Transit": "bg-purple-500",
  "Delivered": "bg-green-500",
  "Delayed": "bg-red-500"
};

const Shipments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredShipments, setFilteredShipments] = useState(shipmentData);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("SupplyChainUser");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the shipments page",
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

  // Filter shipments when search term or status filter changes
  useEffect(() => {
    let results = shipmentData;
    
    if (searchTerm) {
      results = results.filter(shipment => 
        shipment.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      results = results.filter(shipment => shipment.status === statusFilter);
    }
    
    setFilteredShipments(results);
  }, [searchTerm, statusFilter]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading || !isAuthenticated) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden" style={{ width: "100vw" }}>
        {/* Sidebar (hidden on mobile when collapsed) */}
        <div className={`${sidebarCollapsed ? "hidden md:block md:w-16" : ""} transition-all duration-300 flex-shrink-0`}>
          <DashboardSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardHeader onMenuClick={toggleSidebar} title="Shipments" />

          {/* Shipments Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="w-full md:w-auto flex items-center space-x-2">
                <Truck className="h-5 w-5 text-supply-purple" />
                <h1 className="text-2xl font-bold">Shipments</h1>
              </div>
              
              <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search shipments..."
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={() => navigate("/shipments/new")} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> New
                  </Button>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Origin → Destination</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Carrier</TableHead>
                        <TableHead>Est. Delivery</TableHead>
                        <TableHead>Tracking #</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredShipments.length > 0 ? (
                        filteredShipments.map((shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell className="font-medium">{shipment.id}</TableCell>
                            <TableCell>
                              <div>
                                <p>{shipment.productName}</p>
                                <p className="text-xs text-muted-foreground">{shipment.productId}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{shipment.origin}</p>
                                <p className="text-xs text-muted-foreground">→ {shipment.destination}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${(statusColors as any)[shipment.status]}`} />
                                {shipment.status}
                              </div>
                            </TableCell>
                            <TableCell>{shipment.carrier}</TableCell>
                            <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
                            <TableCell className="font-mono text-sm">{shipment.trackingNumber}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Shipment Details",
                                    description: `Viewing details for shipment ${shipment.id}`,
                                  });
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <Truck className="h-10 w-10 mb-2 opacity-50" />
                              <p className="mb-1">No shipments found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Shipments;
