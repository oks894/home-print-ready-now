
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Wifi, WifiOff, Home, Package, MessageCircle, Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AdminHeaderProps {
  onLogout: () => void;
  isRetrying?: boolean;
  onRefresh?: () => void;
}

export const AdminHeader = ({ onLogout, isRetrying = false, onRefresh }: AdminHeaderProps) => {
  const isOnline = navigator.onLine;

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Link to="/">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
              Admin Panel
            </h1>
            
            {/* Connection status - compact on mobile */}
            <Badge variant={isOnline ? "default" : "destructive"} className="gap-1 hidden sm:flex">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
            
            <div className="sm:hidden">
              {isOnline ? 
                <Wifi className="w-4 h-4 text-green-600" /> : 
                <WifiOff className="w-4 h-4 text-red-600" />
              }
            </div>
            
            {isRetrying && (
              <Badge variant="secondary" className="gap-1 hidden sm:flex">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Reconnecting...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isRetrying}
                className="hidden sm:flex"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isRetrying}
                className="sm:hidden p-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              size="sm"
              className="hidden sm:flex"
            >
              Logout
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              size="sm"
              className="sm:hidden px-3"
            >
              Exit
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-center gap-2">
                <Menu className="w-4 h-4" />
                Navigation
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="grid grid-cols-2 gap-3 p-4">
                <Link to="/" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/services" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                    <Package className="w-4 h-4" />
                    Services
                  </Button>
                </Link>
                <Link to="/track" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                    <MessageCircle className="w-4 h-4" />
                    Track Order
                  </Button>
                </Link>
                <Link to="/contact" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                    <Phone className="w-4 h-4" />
                    Contact
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Quick Links */}
        <div className="hidden sm:flex flex-wrap gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="ghost" size="sm" className="gap-2">
              <Package className="w-4 h-4" />
              Services
            </Button>
          </Link>
          <Link to="/track">
            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Track Order
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
