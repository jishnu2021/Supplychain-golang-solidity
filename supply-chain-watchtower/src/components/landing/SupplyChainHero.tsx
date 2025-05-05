
import { Button } from "@/components/ui/button";

interface SupplyChainHeroProps {
  onGetStarted: () => void;
  onDemoClick: () => void;
}

const SupplyChainHero = ({ onGetStarted, onDemoClick }: SupplyChainHeroProps) => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-supply-purple/10 to-supply-dark-purple/10 -z-10" />
      <div 
        className="absolute inset-0 opacity-20 -z-10" 
        style={{
          backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><rect width=\"1\" height=\"1\" fill=\"%239b87f5\" x=\"0\" y=\"0\"/></svg>')",
          backgroundSize: "20px 20px"
        }}
      />
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-supply-deeper-purple mb-6">
              Transparent <span className="text-supply-purple">Blockchain</span> Supply Chain Tracking
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Track your products in real-time with immutable blockchain records for complete transparency and accountability from manufacturing to delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-supply-purple hover:bg-supply-dark-purple" onClick={onGetStarted}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={onDemoClick}>
                View Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-white rounded-lg shadow-xl p-6 md:p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-supply-purple/5 to-supply-dark-purple/5" />
              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-supply-deeper-purple">Product Journey</h3>
                  <div className="flex flex-col md:flex-row justify-between">
                    {["Manufactured", "Shipped", "In Transit", "Delivered"].map((step, index) => (
                      <div key={step} className={`supply-chain-step flex flex-col items-center mb-4 md:mb-0 ${index < 2 ? "text-supply-deeper-purple" : "text-gray-400"}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${index < 2 ? "bg-supply-purple text-white" : "bg-gray-200"}`}>
                          {index + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Batch ID: SC-928742</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified on Chain</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last Updated: 2 hours ago</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm">
                      <p className="font-medium">Location: Distribution Center</p>
                      <p className="text-xs text-gray-500">Est. Delivery: May 5, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplyChainHero;
