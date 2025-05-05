
const steps = [
  {
    number: "01",
    title: "Register Product",
    description: "Enter product details into the system and generate a unique product identifier.",
    color: "bg-supply-purple"
  },
  {
    number: "02",
    title: "Track Shipment",
    description: "Record each checkpoint as products move through the supply chain with timestamp verification.",
    color: "bg-supply-dark-purple"
  },
  {
    number: "03",
    title: "Verify Authenticity",
    description: "Scan the QR code to view the complete history and verify product authenticity.",
    color: "bg-supply-deeper-purple"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-supply-deeper-purple mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our blockchain-powered supply chain tracking system provides end-to-end visibility in just three simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`${step.color} text-white text-4xl font-bold w-16 h-16 flex items-center justify-center rounded-lg mb-4`}>
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-supply-deeper-purple">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -z-10 transform -translate-x-8">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-r from-supply-purple/10 to-supply-dark-purple/10 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <div className="bg-white p-4 rounded-lg shadow-md w-48 h-48 mx-auto flex items-center justify-center">
                <div className="w-full h-full border-2 border-dashed border-supply-purple rounded flex items-center justify-center">
                  <span className="text-4xl font-bold text-supply-purple">QR</span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h3 className="text-2xl font-semibold mb-3 text-supply-deeper-purple">Scan & Verify</h3>
              <p className="text-gray-700 mb-4">
                Each product has its own unique QR code that enables instant access to the entire supply chain history. 
                From manufacturing date to current location, all information is securely stored on the blockchain.
              </p>
              <p className="text-gray-700">
                Customers can simply scan the code with any smartphone to verify product authenticity and review its journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
