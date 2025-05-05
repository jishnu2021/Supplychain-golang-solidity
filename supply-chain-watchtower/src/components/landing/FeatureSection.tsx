
import { 
  CheckCircle, 
  Shield, 
  BarChart3, 
  Zap
} from "lucide-react";

const features = [
  {
    icon: <CheckCircle className="h-8 w-8 text-supply-purple" />,
    title: "Product Verification",
    description: "Verify product authenticity and track complete history from origin to customer."
  },
  {
    icon: <Shield className="h-8 w-8 text-supply-purple" />,
    title: "Immutable Records",
    description: "Blockchain-secured records that can't be tampered with, providing trusted verification."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-supply-purple" />,
    title: "Real-time Analytics",
    description: "Track inventory, shipments, and delivery metrics with advanced analytics dashboard."
  },
  {
    icon: <Zap className="h-8 w-8 text-supply-purple" />,
    title: "QR Code Integration",
    description: "Generate QR codes for quick product scanning and instant history access."
  }
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-supply-deeper-purple mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our blockchain-based tracking system provides complete transparency and accountability across your entire supply chain.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-supply-deeper-purple">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
