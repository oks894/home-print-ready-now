import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Star, TrendingUp } from 'lucide-react';

interface Solver {
  id: string;
  name: string;
  contact: string;
  email: string | null;
  subjects: any;
  class_levels: any;
  total_solved: number;
  total_earned: number;
  rating: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export const SolverManagement = () => {
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSolvers();
  }, []);

  const fetchSolvers = async () => {
    try {
      const { data, error } = await supabase
        .from('assignment_solvers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSolvers(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load solvers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (solverId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('assignment_solvers')
        .update({ is_verified: !currentStatus })
        .eq('id', solverId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Solver ${!currentStatus ? 'verified' : 'unverified'}`,
      });

      fetchSolvers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (solverId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('assignment_solvers')
        .update({ is_active: !currentStatus })
        .eq('id', solverId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Solver ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchSolvers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update active status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading solvers...</div>;
  }

  const stats = {
    total: solvers.length,
    verified: solvers.filter((s) => s.is_verified).length,
    active: solvers.filter((s) => s.is_active).length,
    totalEarnings: solvers.reduce((sum, s) => sum + Number(s.total_earned), 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Solvers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold">₹{stats.totalEarnings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solvers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Solvers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Solved</TableHead>
                  <TableHead>Earned</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solvers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      No solvers registered yet
                    </TableCell>
                  </TableRow>
                ) : (
                  solvers.map((solver) => (
                    <TableRow key={solver.id}>
                      <TableCell className="font-medium">{solver.name}</TableCell>
                      <TableCell className="text-sm">{solver.contact}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {solver.subjects.slice(0, 2).map((subject, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                          {solver.subjects.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{solver.subjects.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{solver.total_solved}</TableCell>
                      <TableCell className="font-semibold">₹{solver.total_earned}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{solver.rating || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {solver.is_verified ? (
                          <Badge className="bg-green-500">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={solver.is_active}
                          onCheckedChange={() => toggleActive(solver.id, solver.is_active)}
                        />
                      </TableCell>
                      <TableCell>
                        {!solver.is_verified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVerification(solver.id, solver.is_verified)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        {solver.is_verified && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleVerification(solver.id, solver.is_verified)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        )}
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
