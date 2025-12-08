import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCoinBalance } from '@/hooks/useCoinBalance';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { UserBottomNav } from '@/components/mobile/UserBottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, Plus, Printer, FileText, HelpCircle, FileEdit,
  ArrowUpRight, ArrowDownLeft, Gift, Copy, Check, History
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, profile, isLoading } = useAuth();
  const { coinBalance, transactions } = useCoinBalance();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) {
      return <ArrowDownLeft className="w-4 h-4 text-ellio-green" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-red-500" />;
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-ellio-green' : 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const quickActions = [
    { icon: Printer, label: 'Print', path: '/printing', color: 'from-ellio-blue to-ellio-purple' },
    { icon: FileText, label: 'Notes', path: '/ellio-notes', color: 'from-ellio-green to-ellio-teal' },
    { icon: HelpCircle, label: 'Help', path: '/assignment-help', color: 'from-ellio-indigo to-ellio-purple' },
    { icon: FileEdit, label: 'Resume', path: '/resume-lab', color: 'from-ellio-purple to-ellio-pink' },
  ];

  return (
    <div className={`min-h-screen bg-background ${isMobile ? 'pb-20' : ''}`}>
      <Header />
      
      <main className={`container mx-auto ${isMobile ? 'px-4 py-4' : 'px-4 py-8'} max-w-6xl`}>
        {/* Welcome Section */}
        <div className={isMobile ? 'mb-4' : 'mb-8'}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-foreground`}>
            Welcome, {profile.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your coins and access services</p>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'lg:grid-cols-3 gap-6'}`}>
          {/* Main Content */}
          <div className={`${isMobile ? '' : 'lg:col-span-2'} space-y-4`}>
            {/* Coin Balance Card */}
            <Card className="bg-gradient-to-br from-ellio-blue to-ellio-purple text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'} relative`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Coin Balance</p>
                    <div className="flex items-center gap-2">
                      <Coins className={isMobile ? 'w-6 h-6' : 'w-8 h-8'} />
                      <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold`}>{coinBalance}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/recharge')}
                    className="bg-white text-ellio-blue hover:bg-white/90"
                    size={isMobile ? 'sm' : 'default'}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Recharge
                  </Button>
                </div>
                {!isMobile && (
                  <p className="text-white/60 text-sm mt-2">
                    Earned: {profile.total_coins_earned} | Spent: {profile.total_coins_spent}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className={isMobile ? 'pb-2' : ''}>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`grid ${isMobile ? 'grid-cols-4 gap-2' : 'grid-cols-4 gap-4'}`}>
                  {quickActions.map((action) => (
                    <button
                      key={action.path}
                      onClick={() => navigate(action.path)}
                      className={`flex flex-col items-center gap-2 ${isMobile ? 'p-3' : 'p-4'} rounded-xl border border-border hover:border-primary/50 hover:bg-accent transition-all group`}
                    >
                      <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                      </div>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-center`}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
                  <History className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6 text-sm">No transactions yet</p>
                ) : (
                  <div className="space-y-2">
                    {transactions.slice(0, isMobile ? 3 : 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            {getTransactionIcon(tx.transaction_type, tx.amount)}
                          </div>
                          <div>
                            <p className="font-medium text-sm line-clamp-1">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold text-sm ${getTransactionColor(tx.amount)}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Only show on desktop */}
          {!isMobile && (
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || ''} 
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ellio-blue to-ellio-purple flex items-center justify-center text-white text-xl font-bold">
                        {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{profile.full_name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-ellio-green/10 text-ellio-green">
                    Member since {new Date(profile.created_at).toLocaleDateString()}
                  </Badge>
                </CardContent>
              </Card>

              {/* Referral Card */}
              <Card className="bg-gradient-to-br from-ellio-purple/10 to-ellio-pink/10 border-ellio-purple/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-ellio-purple/20 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-ellio-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Refer & Earn</h3>
                      <p className="text-sm text-muted-foreground">Get 10 coins per referral</p>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-lg p-3 flex items-center justify-between">
                    <code className="text-sm font-mono">{profile.referral_code || 'N/A'}</code>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={copyReferralCode}
                      disabled={!profile.referral_code}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Coin Pricing Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Coin Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">B&W Print</span>
                    <span className="font-medium">2 coins/page</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Print</span>
                    <span className="font-medium">5 coins/page</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assignment Help</span>
                    <span className="font-medium">15+ coins</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resume Template</span>
                    <span className="font-medium">50 coins</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {!isMobile && <Footer />}
      {isMobile && <UserBottomNav />}
    </div>
  );
};

export default Dashboard;
