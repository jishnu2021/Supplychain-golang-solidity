
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-supply-deeper-purple text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Supply Chain Tracker</h3>
            <div className="flex items-center space-x-2">
              <div className="bg-supply-purple w-8 h-8 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">SC</span>
              </div>
              <span className="text-sm opacity-80">©2025</span>
            </div>
            <p className="mt-4 text-sm opacity-70">
              Blockchain-powered supply chain transparency for the modern world.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Features</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Pricing</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Case Studies</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-supply-purple transition-colors">About</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Team</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Privacy</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Terms</Link></li>
              <li><Link to="/" className="hover:text-supply-purple transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-sm opacity-70 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Supply Chain Tracker. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-supply-purple transition-colors">Twitter</Link>
            <Link to="/" className="hover:text-supply-purple transition-colors">LinkedIn</Link>
            <Link to="/" className="hover:text-supply-purple transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
