
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import { Settings as SettingsIcon, User, Bell, Shield, Key, Wallet } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "Demo User",
    email: "demo@example.com",
    company: "Demo Company",
    role: "Manager"
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    shipmentUpdates: true,
    productRegistration: false,
    weeklyReports: true,
    marketingEmails: false
  });
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("SupplyChainUser");
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to access settings",
        variant: "destructive",
      });
      navigate("/login");
    } else {
      setIsAuthenticated(true);
      
      // Load user data from localStorage if available
      const storedUser = localStorage.getItem("supply-chain-user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setProfileData(prev => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          role: user.role || prev.role
        }));
      }
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user in localStorage
    const user = {
      name: profileData.name,
      email: profileData.email,
      role: profileData.role
    };
    localStorage.setItem("supply-chain-user", JSON.stringify(user));
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully."
    });
  };

  const handleNotificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification settings have been saved."
    });
  };

  const handleToggleNotification = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings]
    }));
  };

  if (loading || !isAuthenticated) {
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ width: "100vw" }}>
      {/* Sidebar (hidden on mobile when collapsed) */}
      <div className={`${sidebarCollapsed ? "hidden md:block md:w-16" : ""} transition-all duration-300 flex-shrink-0`}>
        <DashboardSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader onMenuClick={toggleSidebar} title="Settings" />

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-5 w-5 text-supply-purple mr-2" />
            <h1 className="text-2xl font-bold">Account Settings</h1>
          </div>

          <Tabs defaultValue="profile" className="max-w-3xl">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="billing">
                <Wallet className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={profileData.name} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))} 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profileData.email} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))} 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input 
                          id="company" 
                          value={profileData.company} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))} 
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={profileData.role} 
                          onValueChange={(value) => setProfileData(prev => ({ ...prev, role: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Administrator">Administrator</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Operator">Operator</SelectItem>
                            <SelectItem value="Viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Customize how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNotificationUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="emailAlerts" className="text-base">Email Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                        </div>
                        <Switch 
                          id="emailAlerts" 
                          checked={notificationSettings.emailAlerts}
                          onCheckedChange={() => handleToggleNotification("emailAlerts")}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="shipmentUpdates" className="text-base">Shipment Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified when shipment status changes</p>
                        </div>
                        <Switch 
                          id="shipmentUpdates" 
                          checked={notificationSettings.shipmentUpdates}
                          onCheckedChange={() => handleToggleNotification("shipmentUpdates")}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="productRegistration" className="text-base">Product Registration</Label>
                          <p className="text-sm text-muted-foreground">Notifications for new product registrations</p>
                        </div>
                        <Switch 
                          id="productRegistration" 
                          checked={notificationSettings.productRegistration}
                          onCheckedChange={() => handleToggleNotification("productRegistration")}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="weeklyReports" className="text-base">Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                        </div>
                        <Switch 
                          id="weeklyReports" 
                          checked={notificationSettings.weeklyReports}
                          onCheckedChange={() => handleToggleNotification("weeklyReports")}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="marketingEmails" className="text-base">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive news, updates, and promotional emails</p>
                        </div>
                        <Switch 
                          id="marketingEmails" 
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={() => handleToggleNotification("marketingEmails")}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit">Save Preferences</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      
                      <Button>Update Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        Enable Two-Factor Auth
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">API Keys</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage API keys to integrate our services with your applications.
                      </p>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Manage API Keys
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your subscription and payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-muted/30 rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Current Plan</h3>
                          <p className="text-sm text-muted-foreground">Pro Plan - $49/month</p>
                        </div>
                        <Button variant="outline">Change Plan</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Method</h3>
                      <div className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <span className="font-bold text-sm">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/25</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      
                      <Button variant="outline">Add Payment Method</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <div className="space-y-2">
                        {[
                          { date: "May 1, 2025", amount: "$49.00", status: "Paid" },
                          { date: "Apr 1, 2025", amount: "$49.00", status: "Paid" },
                          { date: "Mar 1, 2025", amount: "$49.00", status: "Paid" },
                        ].map((invoice, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                            <div>
                              <p className="font-medium">{invoice.date}</p>
                              <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-green-600 font-medium">{invoice.status}</span>
                              <Button variant="ghost" size="sm">Download</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
