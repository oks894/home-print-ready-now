
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Wifi, WifiOff, Home, Package, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  onLogout: () => void;
  isRetrying?: boolean;
  onRefresh?: () => void;
}

export const AdminHeader = ({ onLogout, isRetrying = false, onRefresh }: AdminHeaderProps) => {
  const isOnline = navigator.onLine;

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            
            {/* Connection status indicator */}
            <Badge variant={isOnline ? "default" : "destructive"} className="gap-1">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
            
            {isRetrying && (
              <Badge variant="secondary" className="gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Reconnecting...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isRetrying}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
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
