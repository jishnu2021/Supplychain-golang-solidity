
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  onGetStarted: () => void;
}

const CallToAction = ({ onGetStarted }: CallToActionProps) => {
  return (
    <section className="py-16 bg-gradient-to-br from-supply-purple to-supply-dark-purple text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Supply Chain?
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of businesses already using our blockchain-powered platform to ensure transparency 
          and build customer trust through verifiable supply chain data.
        </p>
        <Button 
          onClick={onGetStarted}
          size="lg" 
          className="bg-white text-supply-purple hover:bg-gray-100 hover:text-supply-dark-purple"
        >
          Get Started Today
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
