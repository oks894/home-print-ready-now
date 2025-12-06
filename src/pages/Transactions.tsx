import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useCoinBalance } from '@/hooks/useCoinBalance';
import { 
  ArrowLeft, 
  Coins, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Search,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Transactions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { coinBalance, transactions, isLoading, fetchTransactions } = useCoinBalance();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchQuery, typeFilter]);

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(query) ||
        t.transaction_type.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      if (typeFilter === 'credit') {
        filtered = filtered.filter(t => t.amount > 0);
      } else if (typeFilter === 'debit') {
        filtered = filtered.filter(t => t.amount < 0);
      } else {
        filtered = filtered.filter(t => t.transaction_type === typeFilter);
      }
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (amount: number) => {
    return amount > 0 ? (
      <ArrowUpCircle className="h-5 w-5 text-green-600" />
    ) : (
      <ArrowDownCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getTransactionBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      welcome_bonus: { label: 'Welcome Bonus', className: 'bg-green-100 text-green-800' },
      recharge: { label: 'Recharge', className: 'bg-blue-100 text-blue-800' },
      purchase: { label: 'Purchase', className: 'bg-purple-100 text-purple-800' },
      referral: { label: 'Referral', className: 'bg-orange-100 text-orange-800' },
      refund: { label: 'Refund', className: 'bg-yellow-100 text-yellow-800' },
      admin_adjustment: { label: 'Adjustment', className: 'bg-gray-100 text-gray-800' }
    };
    const badge = badges[type] || { label: type, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const totalCredits = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
              <Coins className="h-8 w-8 text-primary" />
              Transaction History
            </h1>
            <p className="text-muted-foreground">View all your coin transactions</p>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-3xl font-bold text-primary">{coinBalance}</p>
                  </div>
                  <Coins className="h-10 w-10 text-primary/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-3xl font-bold text-green-600">+{totalCredits}</p>
                  </div>
                  <ArrowUpCircle className="h-10 w-10 text-green-500/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-3xl font-bold text-red-600">-{totalDebits}</p>
                  </div>
                  <ArrowDownCircle className="h-10 w-10 text-red-500/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="credit">Credits Only</SelectItem>
                    <SelectItem value="debit">Debits Only</SelectItem>
                    <SelectItem value="welcome_bonus">Welcome Bonus</SelectItem>
                    <SelectItem value="recharge">Recharge</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={fetchTransactions} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transactions</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredTransactions.length} of {transactions.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                      <div className="h-10 w-10 bg-muted rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                      </div>
                      <div className="h-6 bg-muted rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Coins className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                  <p className="text-muted-foreground">
                    {transactions.length === 0 
                      ? "You haven't made any transactions yet."
                      : "No transactions match your filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.amount)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(transaction.created_at), 'MMM d, yyyy • h:mm a')}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-3">
                        {getTransactionBadge(transaction.transaction_type)}
                        <span className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => navigate('/recharge')}>
              <Coins className="h-4 w-4 mr-2" />
              Recharge Coins
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Transactions;
