
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Wifi, WifiOff, Home, Package, MessageCircle, Phone, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useSearch } from '@/components/admin/AdminSearch';

interface AdminHeaderProps {
  onLogout: () => void;
  isRetrying?: boolean;
  onRefresh?: () => void;
}

export const AdminHeader = ({ onLogout, isRetrying = false, onRefresh }: AdminHeaderProps) => {
  const isOnline = navigator.onLine;
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            
            <div className="hidden lg:block h-6 w-px bg-gray-300"></div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-sm">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">ellio Admin</h1>
                <div className="flex items-center gap-2">
                  <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
                    {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                  {isRetrying && (
                    <Badge variant="secondary" className="text-xs">
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Syncing...
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Search (Desktop only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search jobs, customers..." 
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onRefresh}
                disabled={isRetrying}
                className="hover:bg-blue-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline ml-2">Refresh</span>
              </Button>
            )}
            
            <div className="hidden lg:block h-6 w-px bg-gray-300"></div>
            
            <Button 
              variant="ghost" 
              onClick={onLogout}
              size="sm"
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="hidden lg:flex items-center gap-1 pb-4 border-t border-gray-100 pt-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Package className="w-4 h-4 mr-2" />
              Services
            </Button>
          </Link>
          <Link to="/track">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <MessageCircle className="w-4 h-4 mr-2" />
              Track Order
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
