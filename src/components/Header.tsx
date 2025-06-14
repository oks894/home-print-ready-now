
import { Link } from 'react-router-dom';
import { Printer, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Printer className="w-6 h-6" />
          PrintReady
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
            Services
          </Link>
          <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <Link to="/track" className="text-gray-600 hover:text-blue-600 transition-colors">
            Track
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </nav>

        <Link to="/admin">
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
