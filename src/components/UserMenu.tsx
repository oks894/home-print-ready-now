import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Coins, User, LogOut, LayoutDashboard, History, Plus } from 'lucide-react';

const UserMenu = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-24 h-10 bg-accent animate-pulse rounded-lg" />
    );
  }

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        className="bg-gradient-to-r from-ellio-blue to-ellio-purple hover:opacity-90"
      >
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Coin Balance */}
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/recharge')}
        className="hidden sm:flex items-center gap-2 border-ellio-blue/30 hover:bg-ellio-blue/10"
      >
        <Coins className="w-4 h-4 text-ellio-blue" />
        <span className="font-semibold">{profile?.coin_balance || 0}</span>
        <Plus className="w-3 h-3 text-muted-foreground" />
      </Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || ''} 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ellio-blue to-ellio-purple flex items-center justify-center text-white font-semibold">
                {profile?.full_name?.charAt(0) || profile?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="font-medium text-sm">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{profile?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Coins className="w-3 h-3 text-ellio-blue" />
              <span className="text-xs font-medium">{profile?.coin_balance || 0} coins</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/recharge')}>
            <Plus className="w-4 h-4 mr-2" />
            Recharge Coins
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/transactions')}>
            <History className="w-4 h-4 mr-2" />
            Transaction History
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
