import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Star, TrendingUp, Loader2, ChevronRight, Phone, Mail } from 'lucide-react';

interface Solver {
  id: string;
  name: string;
  contact: string;
  email: string | null;
  subjects: any;
  class_levels: any;
  total_solved: number;
  total_earned: number;
  rating: number | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export const MobileSolverManagement = () => {
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolver, setSelectedSolver] = useState<Solver | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
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

  const toggleVerification = async (solver: Solver) => {
    setProcessing(solver.id);
    try {
      const { error } = await supabase
        .from('assignment_solvers')
        .update({ is_verified: !solver.is_verified })
        .eq('id', solver.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Solver ${!solver.is_verified ? 'verified' : 'unverified'}`,
      });

      fetchSolvers();
      setSelectedSolver(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update verification',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const toggleActive = async (solver: Solver) => {
    setProcessing(solver.id);
    try {
      const { error } = await supabase
        .from('assignment_solvers')
        .update({ is_active: !solver.is_active })
        .eq('id', solver.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Solver ${!solver.is_active ? 'activated' : 'deactivated'}`,
      });

      fetchSolvers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: solvers.length,
    verified: solvers.filter((s) => s.is_verified).length,
    active: solvers.filter((s) => s.is_active).length,
    totalEarnings: solvers.reduce((sum, s) => sum + Number(s.total_earned), 0),
  };

  return (
    <div className="space-y-4 px-4 pb-24">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verified</p>
                <p className="text-xl font-bold">{stats.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <p className="text-xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ellio-green/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-ellio-green" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paid Out</p>
                <p className="text-xl font-bold">₹{stats.totalEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solvers List */}
      {solvers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No solvers registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {solvers.map((solver) => (
            <Card 
              key={solver.id}
              className="cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => setSelectedSolver(solver)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{solver.name}</p>
                      {solver.is_verified ? (
                        <Badge className="bg-green-500 text-xs">Verified</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{solver.contact}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{solver.rating || 0}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm">{solver.total_solved} solved</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm font-semibold text-ellio-green">₹{solver.total_earned}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={solver.is_active}
                      onCheckedChange={() => toggleActive(solver)}
                      disabled={processing === solver.id}
                    />
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Solver Details Sheet */}
      <Sheet open={!!selectedSolver} onOpenChange={() => setSelectedSolver(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Solver Details</SheetTitle>
          </SheetHeader>
          {selectedSolver && (
            <div className="mt-6 space-y-6">
              {/* Solver Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-xl">{selectedSolver.name}</p>
                      {selectedSolver.is_verified ? (
                        <Badge className="bg-green-500 mt-1">Verified Solver</Badge>
                      ) : (
                        <Badge variant="secondary" className="mt-1">Pending Verification</Badge>
                      )}
                    </div>
                    <Switch
                      checked={selectedSolver.is_active}
                      onCheckedChange={() => toggleActive(selectedSolver)}
                      disabled={processing === selectedSolver.id}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${selectedSolver.contact}`} className="text-primary">
                        {selectedSolver.contact}
                      </a>
                    </div>
                    {selectedSolver.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedSolver.email}`} className="text-primary">
                          {selectedSolver.email}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-gradient-to-r from-ellio-purple to-ellio-blue text-white">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-white/80 text-sm">Solved</p>
                      <p className="text-2xl font-bold">{selectedSolver.total_solved}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Earned</p>
                      <p className="text-2xl font-bold">₹{selectedSolver.total_earned}</p>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm">Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <p className="text-2xl font-bold">{selectedSolver.rating || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subjects */}
              <div>
                <p className="text-sm font-semibold mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedSolver.subjects) ? selectedSolver.subjects : []).map((subject: string, idx: number) => (
                    <Badge key={idx} variant="secondary">{subject}</Badge>
                  ))}
                </div>
              </div>

              {/* Class Levels */}
              <div>
                <p className="text-sm font-semibold mb-2">Class Levels</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(selectedSolver.class_levels) ? selectedSolver.class_levels : []).map((level: string, idx: number) => (
                    <Badge key={idx} variant="outline">{level}</Badge>
                  ))}
                </div>
              </div>

              {/* Verification Button */}
              {!selectedSolver.is_verified ? (
                <Button
                  className="w-full h-12 bg-ellio-green hover:bg-ellio-green/90"
                  onClick={() => toggleVerification(selectedSolver)}
                  disabled={processing === selectedSolver.id}
                >
                  {processing === selectedSolver.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verify This Solver
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  className="w-full h-12"
                  onClick={() => toggleVerification(selectedSolver)}
                  disabled={processing === selectedSolver.id}
                >
                  {processing === selectedSolver.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Revoke Verification
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileSolverManagement;
