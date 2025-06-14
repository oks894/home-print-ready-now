
import { Link } from 'react-router-dom';
import { Printer, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        {/* Desktop Header */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
            <Printer className="w-6 h-6" />
            <span className="hidden sm:block">PrintReady</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Services
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/track" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Track
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/admin" className="hidden sm:block">
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/services" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/pricing" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/track" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium py-2 px-2 rounded-lg hover:bg-blue-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/admin" 
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
