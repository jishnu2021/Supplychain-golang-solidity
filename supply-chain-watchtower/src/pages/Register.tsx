
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { registerUser } from "@/api";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.agreeToTerms) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
  
      if (response) {
        // Save all form data under the role key
        localStorage.setItem("SupplyChainUser", JSON.stringify(formData));
      } else {
        console.warn("Role is missing");
      }
  
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      });
  
      navigate("/");
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-auth-pattern py-12" style={{ width: "100vw", overflowX: "hidden" }}>
      <div className="w-full max-w-md p-8 auth-card">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-supply-purple w-10 h-10 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">SC</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-gray-600 mt-2">Start tracking your supply chain</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Smith"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
                        <Select 
                          value={formData.role} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
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

            <div className="flex items-start space-x-2 mt-4">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm leading-tight cursor-pointer"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-supply-purple hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-supply-purple hover:underline">
                  privacy policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-supply-purple hover:bg-supply-dark-purple mt-4"
              disabled={isLoading || !formData.agreeToTerms}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-supply-purple font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
