import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Download, DollarSign, Users, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Purchase {
  id: string;
  user_email: string;
  template_id: string;
  amount_paid: number;
  payment_reference: string | null;
  purchase_date: string;
  resume_templates: {
    name: string;
    category: string;
  };
}

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = purchases.filter(p => 
        p.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.resume_templates.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPurchases(filtered);
    } else {
      setFilteredPurchases(purchases);
    }
  }, [searchTerm, purchases]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('resume_purchases')
        .select(`
          *,
          resume_templates (
            name,
            category
          )
        `)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
      setFilteredPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchase history');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = purchases.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const uniqueUsers = new Set(purchases.map(p => p.user_email)).size;
  const averageValue = purchases.length ? totalRevenue / purchases.length : 0;

  if (loading) {
    return <div className="text-center py-8">Loading purchases...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Purchases</p>
              <p className="text-2xl font-bold">{purchases.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold">{uniqueUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Value</p>
              <p className="text-2xl font-bold">₹{averageValue.toFixed(0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search by email, template, or reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No purchases found matching your search' : 'No purchases yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">
                    {format(new Date(purchase.purchase_date), 'MMM dd, yyyy')}
                    <div className="text-xs text-gray-500">
                      {format(new Date(purchase.purchase_date), 'hh:mm a')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{purchase.user_email}</div>
                  </TableCell>
                  <TableCell>
                    {purchase.resume_templates.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {purchase.resume_templates.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-green-600">
                      ₹{Number(purchase.amount_paid).toFixed(0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600 font-mono">
                      {purchase.payment_reference || 'N/A'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default PurchaseHistory;
