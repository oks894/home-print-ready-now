import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Calendar } from 'lucide-react';

interface Transaction {
  id: string;
  assignment_id: string;
  student_name: string;
  solver_name: string | null;
  total_amount: number;
  dynamic_edu_amount: number;
  solver_amount: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  released_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
}

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, dateRange]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('assignment_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.solver_name && t.solver_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (t.payment_reference && t.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (dateRange.start) {
      filtered = filtered.filter((t) => new Date(t.created_at) >= new Date(dateRange.start));
    }

    if (dateRange.end) {
      filtered = filtered.filter((t) => new Date(t.created_at) <= new Date(dateRange.end));
    }

    setFilteredTransactions(filtered);
  };

  const calculateTotals = () => {
    return filteredTransactions.reduce(
      (acc, t) => ({
        totalAmount: acc.totalAmount + Number(t.total_amount),
        dynamicEduAmount: acc.dynamicEduAmount + Number(t.dynamic_edu_amount),
        solverAmount: acc.solverAmount + Number(t.solver_amount),
      }),
      { totalAmount: 0, dynamicEduAmount: 0, solverAmount: 0 }
    );
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Student',
      'Solver',
      'Total Amount',
      'Dynamic Edu',
      'Solver Payment',
      'Status',
      'Payment Method',
      'Reference',
    ];

    const rows = filteredTransactions.map((t) => [
      new Date(t.created_at).toLocaleDateString(),
      t.student_name,
      t.solver_name || '-',
      `₹${t.total_amount}`,
      `₹${t.dynamic_edu_amount}`,
      `₹${t.solver_amount}`,
      t.status,
      t.payment_method || '-',
      t.payment_reference || '-',
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totals = calculateTotals();

  if (loading) {
    return <div className="text-center py-8">Loading transaction history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
            <p className="text-2xl font-bold">₹{totals.totalAmount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Dynamic Edu Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{totals.dynamicEduAmount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Solver Payments</p>
            <p className="text-2xl font-bold text-blue-600">₹{totals.solverAmount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Export */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student, solver, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-[150px]"
              />
              <Input
                type="date"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-[150px]"
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Solver</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Dynamic Edu</TableHead>
                  <TableHead>Solver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.student_name}</TableCell>
                      <TableCell>{transaction.solver_name || '-'}</TableCell>
                      <TableCell className="font-semibold">₹{transaction.total_amount}</TableCell>
                      <TableCell className="text-green-600">
                        ₹{transaction.dynamic_edu_amount}
                      </TableCell>
                      <TableCell className="text-blue-600">₹{transaction.solver_amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === 'completed'
                              ? 'default'
                              : transaction.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.payment_reference || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
