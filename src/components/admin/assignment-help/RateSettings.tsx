import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Save, Trash2, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RateSetting {
  id: string;
  subject: string;
  base_rate: number;
  urgent_fee_normal: number;
  urgent_fee_high: number;
  solver_percentage: number;
  dynamic_edu_percentage: number;
  is_active: boolean;
}

export const RateSettings = () => {
  const [rates, setRates] = useState<RateSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRate, setNewRate] = useState({
    subject: '',
    base_rate: 15,
    urgent_fee_normal: 5,
    urgent_fee_high: 10,
    solver_percentage: 60,
    dynamic_edu_percentage: 40,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('assignment_rate_settings')
        .select('*')
        .eq('is_active', true)
        .order('subject');

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load rate settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAmounts = (baseRate: number, solverPercentage: number) => {
    const solverAmount = (baseRate * solverPercentage) / 100;
    const dynamicEduAmount = baseRate - solverAmount;
    return { solverAmount, dynamicEduAmount };
  };

  const handleAddRate = async () => {
    if (!newRate.subject.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a subject name',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('assignment_rate_settings').insert([newRate]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Rate setting added successfully',
      });

      setNewRate({
        subject: '',
        base_rate: 15,
        urgent_fee_normal: 5,
        urgent_fee_high: 10,
        solver_percentage: 60,
        dynamic_edu_percentage: 40,
      });

      fetchRates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add rate setting',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateRate = async (id: string, updates: Partial<RateSetting>) => {
    try {
      const { error } = await supabase
        .from('assignment_rate_settings')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Rate setting updated',
      });

      fetchRates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update rate setting',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteRate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('assignment_rate_settings')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Rate setting deleted',
      });

      fetchRates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete rate setting',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading rate settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add New Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Subject Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="e.g., Mathematics"
                value={newRate.subject}
                onChange={(e) => setNewRate({ ...newRate, subject: e.target.value })}
              />
            </div>
            <div>
              <Label>Base Rate (₹)</Label>
              <Input
                type="number"
                value={newRate.base_rate}
                onChange={(e) =>
                  setNewRate({ ...newRate, base_rate: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Urgent Fee - Normal (₹)</Label>
              <Input
                type="number"
                value={newRate.urgent_fee_normal}
                onChange={(e) =>
                  setNewRate({ ...newRate, urgent_fee_normal: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Urgent Fee - High (₹)</Label>
              <Input
                type="number"
                value={newRate.urgent_fee_high}
                onChange={(e) =>
                  setNewRate({ ...newRate, urgent_fee_high: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Solver Percentage (%)</Label>
              <Input
                type="number"
                max="100"
                value={newRate.solver_percentage}
                onChange={(e) => {
                  const solverPct = Number(e.target.value);
                  setNewRate({
                    ...newRate,
                    solver_percentage: solverPct,
                    dynamic_edu_percentage: 100 - solverPct,
                  });
                }}
              />
            </div>
            <div>
              <Label>Dynamic Edu Percentage (%)</Label>
              <Input type="number" value={newRate.dynamic_edu_percentage} disabled />
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold mb-2">Preview Calculation:</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Base Rate:</span>
                <p className="font-semibold">₹{newRate.base_rate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Solver Gets:</span>
                <p className="font-semibold text-green-600">
                  ₹{calculateAmounts(newRate.base_rate, newRate.solver_percentage).solverAmount}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Dynamic Edu Gets:</span>
                <p className="font-semibold text-blue-600">
                  ₹
                  {calculateAmounts(newRate.base_rate, newRate.solver_percentage).dynamicEduAmount}
                </p>
              </div>
            </div>
          </div>

          <Button onClick={handleAddRate} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rate Setting
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Current Rate Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Urgent (Normal)</TableHead>
                  <TableHead>Urgent (High)</TableHead>
                  <TableHead>Solver %</TableHead>
                  <TableHead>Dynamic Edu %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No rate settings configured
                    </TableCell>
                  </TableRow>
                ) : (
                  rates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.subject}</TableCell>
                      <TableCell>₹{rate.base_rate}</TableCell>
                      <TableCell>₹{rate.urgent_fee_normal}</TableCell>
                      <TableCell>₹{rate.urgent_fee_high}</TableCell>
                      <TableCell>{rate.solver_percentage}%</TableCell>
                      <TableCell>{rate.dynamic_edu_percentage}%</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRate(rate.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
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
