import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  IndianRupee,
  CheckCircle,
  ArrowLeft,
  Users,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Solver {
  id: string;
  name: string;
  total_solved: number;
  total_earned: number;
  rating: number | null;
  subjects: unknown;
  is_verified: boolean;
}

const SolverLeaderboard = () => {
  const navigate = useNavigate();
  const [solvers, setSolvers] = useState<Solver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'earnings' | 'solved' | 'rating'>('earnings');

  useEffect(() => {
    fetchSolvers();
  }, []);

  const fetchSolvers = async () => {
    try {
      const { data, error } = await supabase
        .from('assignment_solvers')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true);

      if (error) throw error;
      setSolvers(data || []);
    } catch (err) {
      console.error('Error fetching solvers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedSolvers = () => {
    return [...solvers].sort((a, b) => {
      switch (sortBy) {
        case 'earnings':
          return Number(b.total_earned) - Number(a.total_earned);
        case 'solved':
          return b.total_solved - a.total_solved;
        case 'rating':
          return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        default:
          return 0;
      }
    });
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />;
    if (index === 2) return <Award className="w-8 h-8 text-amber-600" />;
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
        {index + 1}
      </div>
    );
  };

  const getRankBackground = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-300';
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-300';
    if (index === 2) return 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-300';
    return '';
  };

  const renderStars = (rating: number | null) => {
    const starCount = Math.round(Number(rating) || 0);
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= starCount ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const sortedSolvers = getSortedSolvers();
  const topSolvers = sortedSolvers.slice(0, 3);
  const otherSolvers = sortedSolvers.slice(3);

  // Stats
  const totalSolvers = solvers.length;
  const totalAssignmentsSolved = solvers.reduce((sum, s) => sum + s.total_solved, 0);
  const totalEarnings = solvers.reduce((sum, s) => sum + Number(s.total_earned), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-background dark:via-background dark:to-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/assignment-help')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignment Help
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full mb-4">
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Solver Leaderboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Top Assignment Solvers
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet our verified solvers who are helping students excel in their academics
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Verified Solvers</p>
                    <p className="text-3xl font-bold text-indigo-600">{totalSolvers}</p>
                  </div>
                  <Users className="h-10 w-10 text-indigo-500/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Assignments Solved</p>
                    <p className="text-3xl font-bold text-purple-600">{totalAssignmentsSolved}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-purple-500/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid to Solvers</p>
                    <p className="text-3xl font-bold text-green-600 flex items-center">
                      <IndianRupee className="h-6 w-6" />
                      {totalEarnings}
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-500/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sort Tabs */}
          <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)} className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="earnings" className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="solved" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger value="rating" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Rating
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedSolvers.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Verified Solvers Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to register as a solver and start earning!
                </p>
                <Button onClick={() => navigate('/solver-registration')}>
                  Register as Solver
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Top 3 Podium */}
              {topSolvers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {topSolvers.map((solver, index) => (
                    <motion.div
                      key={solver.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}
                    >
                      <Card className={`${getRankBackground(index)} border-2 text-center py-8`}>
                        <CardContent>
                          <div className="flex justify-center mb-4">
                            {getRankIcon(index)}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{solver.name}</h3>
                          <div className="flex justify-center mb-3">
                            {renderStars(solver.rating)}
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                              <IndianRupee className="h-4 w-4" />
                              {solver.total_earned} earned
                            </p>
                            <p className="text-muted-foreground">
                              {solver.total_solved} assignments solved
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-center mt-4">
                            {(Array.isArray(solver.subjects) ? solver.subjects : []).slice(0, 3).map((subject, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {String(subject)}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Rest of Solvers */}
              {otherSolvers.map((solver, index) => (
                <motion.div
                  key={solver.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 3) * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 3)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold truncate">{solver.name}</h3>
                            {solver.is_verified && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{solver.total_solved} solved</span>
                            {renderStars(solver.rating)}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(Array.isArray(solver.subjects) ? solver.subjects : []).slice(0, 4).map((subject, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {String(subject)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <p className="text-2xl font-bold text-green-600 flex items-center">
                            <IndianRupee className="h-5 w-5" />
                            {solver.total_earned}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Earned</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA */}
          <Card className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardContent className="py-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Want to Join the Leaderboard?</h3>
              <p className="opacity-90 mb-6">
                Register as a solver and start earning by helping students with their assignments
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => navigate('/solver-registration')}
              >
                Register as Solver
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SolverLeaderboard;
