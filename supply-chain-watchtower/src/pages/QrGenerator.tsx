
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import { QrCode, Download, Package } from "lucide-react";

// Sample product data for the dropdown
const productOptions = [
  { id: "SC-928742", name: "Organic Coffee Beans" },
  { id: "SC-928743", name: "Bamboo Toothbrushes" },
  { id: "SC-928744", name: "Recycled Paper Notebooks" },
  { id: "SC-928745", name: "Eco-friendly Soap" }
];

const QrGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qrType, setQrType] = useState("product");
  const [batchId, setBatchId] = useState("");
  const [customId, setCustomId] = useState("");
  const [generatedQRs, setGeneratedQRs] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("SupplyChainUser");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the QR generator",
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

  const handleGenerateQR = () => {
    let id = "";
    
    if (qrType === "product" && selectedProduct) {
      id = selectedProduct;
    } else if (qrType === "batch" && batchId) {
      id = `BATCH-${batchId}`;
    } else if (qrType === "custom" && customId) {
      id = `CUSTOM-${customId}`;
    } else {
      toast({
        title: "Validation Error",
        description: "Please select a product or enter a valid ID",
        variant: "destructive",
      });
      return;
    }
    
    // Add to generated QRs list
    setGeneratedQRs(prev => [id, ...prev]);
    
    toast({
      title: "QR Code Generated",
      description: `Successfully generated QR code for ${id}`,
    });
  };

  const handleDownload = (qrId: string) => {
    toast({
      title: "Download Initiated",
      description: `Downloading QR code for ${qrId}`,
    });
    // In a real app, this would trigger a download of the QR code image
  };

  const getProductName = (id: string) => {
    if (id.startsWith("BATCH-")) return `Batch: ${id.replace("BATCH-", "")}`;
    if (id.startsWith("CUSTOM-")) return `Custom: ${id.replace("CUSTOM-", "")}`;
    const product = productOptions.find(p => p.id === id);
    return product ? product.name : id;
  };

  if (loading || !isAuthenticated) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (hidden on mobile when collapsed) */}
      <div className={`${sidebarCollapsed ? "hidden md:block md:w-16" : ""} transition-all duration-300 flex-shrink-0`}>
        <DashboardSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onMenuClick={toggleSidebar} title="QR Generator" />

        {/* QR Generator Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Generator Panel */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Generate QR Code</CardTitle>
                <CardDescription>Create blockchain-verified QR codes for your products</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="product" onValueChange={setQrType}>
                  <TabsList className="mb-6">
                    <TabsTrigger value="product">Product</TabsTrigger>
                    <TabsTrigger value="batch">Batch</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="product">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="product-select">Select Product</Label>
                        <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {productOptions.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button onClick={() => navigate("/products")}>View All Products</Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="batch">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="batch-id">Batch Identifier</Label>
                        <Input 
                          id="batch-id" 
                          placeholder="Enter batch ID or number" 
                          value={batchId}
                          onChange={(e) => setBatchId(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate a QR code for an entire batch of products at once.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="custom">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="custom-id">Custom Identifier</Label>
                        <Input 
                          id="custom-id" 
                          placeholder="Enter custom identification" 
                          value={customId}
                          onChange={(e) => setCustomId(e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Create a QR code with custom identification for special purposes.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <Button 
                    onClick={handleGenerateQR} 
                    className="w-full mt-6 bg-supply-purple hover:bg-supply-dark-purple"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Generate QR Code
                  </Button>
                </Tabs>
              </CardContent>
            </Card>

            {/* QR Display Panel */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Generated QR Codes</CardTitle>
                <CardDescription>Recently generated QR codes ready for download</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedQRs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedQRs.map((qrId, i) => (
                      <div key={i} className="border rounded-md p-4 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm w-32 h-32 mb-3 flex items-center justify-center">
                          <div className="w-full h-full border-2 border-dashed border-supply-purple rounded flex flex-col items-center justify-center text-center gap-2">
                            <QrCode className="h-10 w-10 text-supply-purple" />
                            <span className="text-xs font-mono truncate max-w-full">{qrId}</span>
                          </div>
                        </div>
                        <p className="text-sm font-medium mb-2 text-center">{getProductName(qrId)}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full"
                          onClick={() => handleDownload(qrId)}
                        >
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <QrCode className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                    <p className="text-muted-foreground">No QR codes generated yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a product or ID and generate your first QR code
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* QR Usage Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Use Supply Chain QR Codes</CardTitle>
              <CardDescription>Learn how to effectively implement QR codes in your supply chain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-supply-purple/10 flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-supply-purple" />
                  </div>
                  <h3 className="font-medium mb-2">Generate & Print</h3>
                  <p className="text-sm text-muted-foreground">
                    Create QR codes for products or batches and print them on packaging or labels.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-supply-purple/10 flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-supply-purple" />
                  </div>
                  <h3 className="font-medium mb-2">Link to Blockchain</h3>
                  <p className="text-sm text-muted-foreground">
                    Each QR code is automatically linked to the product's blockchain record.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-supply-purple/10 flex items-center justify-center mb-4">
                    <svg 
                      className="h-6 w-6 text-supply-purple" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-2">Scan & Verify</h3>
                  <p className="text-sm text-muted-foreground">
                    Customers scan QR codes to view the complete product journey and authenticate products.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
