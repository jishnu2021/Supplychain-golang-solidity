import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  BarChart3,
  Clock,
  QrCode
} from "lucide-react";

// Sample data for product details
const productData = {
  "SC-928742": {
    id: "SC-928742",
    name: "Organic Coffee Beans",
    description: "Premium single-origin organic coffee beans from the highlands of Colombia.",
    category: "Food & Beverage",
    status: "In Transit",
    origin: "Colombia",
    destination: "United States",
    manufacturer: "BeanWorks Co.",
    batchNumber: "BW-2025-042",
    manufactureDate: "2025-04-15",
    expiryDate: "2026-04-15",
    weight: "500kg",
    lastUpdated: "2025-05-01T10:24:00",
    trackingEvents: [
      { 
        timestamp: "2025-04-15T08:00:00",
        status: "Manufactured",
        location: "Bogotá, Colombia",
        description: "Product manufactured and quality checked"
      },
      { 
        timestamp: "2025-04-17T14:30:00",
        status: "Quality Control",
        location: "Bogotá, Colombia",
        description: "Product passed quality control inspection"
      },
      { 
        timestamp: "2025-04-20T09:15:00",
        status: "Shipped",
        location: "Cartagena Port, Colombia",
        description: "Product shipped via ocean freight"
      },
      { 
        timestamp: "2025-05-01T10:24:00",
        status: "In Transit",
        location: "Caribbean Sea",
        description: "Shipment in transit to Miami Port, USA"
      }
    ]
  },
  "SC-928743": {
    id: "SC-928743",
    name: "Bamboo Toothbrushes",
    description: "Eco-friendly bamboo toothbrushes with biodegradable handles.",
    category: "Healthcare",
    status: "Delivered",
    origin: "Indonesia",
    destination: "Canada",
    manufacturer: "EcoSmile Inc.",
    batchNumber: "ES-2025-118",
    manufactureDate: "2025-04-05",
    expiryDate: "2027-04-05",
    weight: "200kg",
    lastUpdated: "2025-04-29T14:30:00",
    trackingEvents: [
      { 
        timestamp: "2025-04-05T10:00:00",
        status: "Manufactured",
        location: "Jakarta, Indonesia",
        description: "Product manufactured and packaged"
      },
      { 
        timestamp: "2025-04-08T13:45:00",
        status: "Quality Control",
        location: "Jakarta, Indonesia",
        description: "Quality control inspection completed"
      },
      { 
        timestamp: "2025-04-10T08:30:00",
        status: "Shipped",
        location: "Jakarta Port, Indonesia",
        description: "Product shipped via air freight"
      },
      { 
        timestamp: "2025-04-20T16:15:00",
        status: "In Transit",
        location: "Singapore",
        description: "Transfer to international carrier"
      },
      { 
        timestamp: "2025-04-28T11:20:00",
        status: "Arrived",
        location: "Vancouver, Canada",
        description: "Shipment arrived at destination port"
      },
      { 
        timestamp: "2025-04-29T14:30:00",
        status: "Delivered",
        location: "Toronto, Canada",
        description: "Product delivered to distribution center"
      }
    ]
  },
  "SC-928744": {
    id: "SC-928744",
    name: "Recycled Paper Notebooks",
    description: "100% recycled paper notebooks with soy-based ink printing.",
    category: "Stationery",
    status: "Manufactured",
    origin: "Brazil",
    destination: "Germany",
    manufacturer: "GreenPaper Co.",
    batchNumber: "GP-2025-067",
    manufactureDate: "2025-05-02",
    expiryDate: "N/A",
    weight: "300kg",
    lastUpdated: "2025-05-02T08:15:00",
    trackingEvents: [
      { 
        timestamp: "2025-05-02T08:15:00",
        status: "Manufactured",
        location: "São Paulo, Brazil",
        description: "Product manufactured and ready for shipping"
      }
    ]
  },
  "SC-928745": {
    id: "SC-928745",
    name: "Eco-friendly Soap",
    description: "Natural handmade soap with organic ingredients and plastic-free packaging.",
    category: "Personal Care",
    status: "Shipped",
    origin: "France",
    destination: "Japan",
    manufacturer: "NatureSuds",
    batchNumber: "NS-2025-093",
    manufactureDate: "2025-04-25",
    expiryDate: "2026-10-25",
    weight: "150kg",
    lastUpdated: "2025-04-30T16:45:00",
    trackingEvents: [
      { 
        timestamp: "2025-04-25T09:30:00",
        status: "Manufactured",
        location: "Marseille, France",
        description: "Product manufactured and cured"
      },
      { 
        timestamp: "2025-04-28T11:15:00",
        status: "Quality Control",
        location: "Marseille, France",
        description: "Product passed quality testing"
      },
      { 
        timestamp: "2025-04-30T16:45:00",
        status: "Shipped",
        location: "Marseille Port, France",
        description: "Product shipped via ocean freight to Japan"
      }
    ]
  }
};

// Status colors
const statusColors = {
  "Manufactured": "bg-blue-500",
  "Shipped": "bg-yellow-500",
  "In Transit": "bg-purple-500",
  "Delivered": "bg-green-500",
  "Delayed": "bg-red-500",
  "Quality Control": "bg-sky-500",
  "Arrived": "bg-teal-500"
};

const ProductDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    
    const token = localStorage.getItem("SupplyChainUser");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access product details",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }

    // Get product details
    if (id && (productData as any)[id]) {
      setProduct((productData as any)[id]);
    } else {
      toast({
        title: "Product not found",
        description: `No product with ID ${id} exists.`,
        variant: "destructive",
      });
      navigate("/products");
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
  }, [navigate, toast, id]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleViewQR = () => {
    setShowQR(true);
  };

  const formatDate = (dateString: string) => {
    if (dateString === "N/A") return dateString;
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading || !isAuthenticated || !product) {
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
          <DashboardHeader onMenuClick={toggleSidebar} title="Product Detail" />

          {/* Back Button and Title */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => navigate("/products")} className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleViewQR}>
                  <QrCode className="h-4 w-4 mr-2" />
                  View QR Code
                </Button>
              </div>
            </div>

            {showQR && (
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Product QR Code</span>
                    <Button variant="ghost" size="sm" onClick={() => setShowQR(false)}>Close</Button>
                  </CardTitle>
                  <CardDescription>Scan with a mobile device to verify product authenticity</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm w-48 h-48 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-dashed border-supply-purple rounded flex flex-col items-center justify-center text-center gap-2">
                      <QrCode className="h-16 w-16 text-supply-purple" />
                      <span className="text-xs text-muted-foreground">Secure Blockchain QR</span>
                      <span className="text-xs font-mono">{product.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Info */}
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium text-white ${(statusColors as any)[product.status]}`}>
                      {product.status}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details">
                    <TabsList className="mb-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="shipping">Shipping</TabsTrigger>
                      <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Product ID</p>
                          <p>{product.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
                          <p>{product.category}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Manufacturer</p>
                          <p>{product.manufacturer}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Batch Number</p>
                          <p>{product.batchNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Manufacture Date</p>
                          <p>{formatDate(product.manufactureDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Expiry Date</p>
                          <p>{formatDate(product.expiryDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Weight</p>
                          <p>{product.weight}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                          <p>{formatTimestamp(product.lastUpdated)}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="shipping" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex gap-2 items-start">
                          <MapPin className="h-5 w-5 text-supply-purple mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Origin</p>
                            <p>{product.origin}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-start">
                          <MapPin className="h-5 w-5 text-supply-purple mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Destination</p>
                            <p>{product.destination}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-4">Shipping Status</h4>
                        <div className="space-y-6">
                          {product.trackingEvents.map((event: any, index: number) => (
                            <div key={index} className="relative pl-6 pb-6">
                              {index < product.trackingEvents.length - 1 && (
                                <div className="absolute top-2 left-2 bottom-0 w-0.5 bg-muted"></div>
                              )}
                              <div className={`absolute top-2 left-0 w-4 h-4 rounded-full border-2 border-white ${(statusColors as any)[event.status] || "bg-gray-400"}`}></div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{event.status}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimestamp(event.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm">{event.location}</p>
                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="blockchain" className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-md mb-4">
                        <p className="text-sm">All product events are securely stored on the blockchain for tamper-proof verification.</p>
                      </div>
                      
                      <div className="space-y-4">
                        {product.trackingEvents.map((event: any, index: number) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{event.status}</span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified on Chain</span>
                            </div>
                            <div className="text-sm mb-2">
                              <span className="inline-block mr-2"><Clock className="h-3.5 w-3.5 inline mr-1" />{formatTimestamp(event.timestamp)}</span>
                              <span><MapPin className="h-3.5 w-3.5 inline mr-1" />{event.location}</span>
                            </div>
                            <div className="text-xs font-mono bg-muted/50 p-2 rounded-sm overflow-x-auto">
                              0x82f9b7d324{index}e9a21b7f9c123d45678901fe2{index}a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Supply Chain Progress */}
              <div className="w-full flex flex-col gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Supply Chain Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-6">
                      {["Manufactured", "Shipped", "In Transit", "Delivered"].map((step, index) => {
                        // Find if this step exists in tracking events
                        const completed = product.trackingEvents.some(
                          (e: any) => e.status === step
                        );
                        const isCurrentStep = product.status === step;
                        
                        return (
                          <div key={step} className="flex items-start space-x-3">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                                completed || isCurrentStep ? "bg-supply-purple text-white" : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex flex-col">
                              <span className={completed || isCurrentStep ? "font-medium" : "text-muted-foreground"}>
                                {step}
                              </span>
                              {step === product.status && (
                                <span className="text-xs text-muted-foreground">Current status</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-supply-purple mr-2" />
                      <span className="text-sm">{product.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-supply-purple mr-2" />
                      <span className="text-sm">{product.origin} → {product.destination}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-supply-purple mr-2" />
                      <span className="text-sm">{formatDate(product.manufactureDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProductDetail;
