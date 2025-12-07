import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, TrendingUp, DollarSign, Clock, Upload, FileText, Eye, Star, Trophy, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const SolverDashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchContact, setSearchContact] = useState('');
  const [solverData, setSolverData] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [solution, setSolution] = useState({ text: '', files: [] as File[] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = async () => {
    if (!searchContact.trim()) {
      toast.error('Please enter your registered contact');
      return;
    }

    try {
      const { data: solver, error: solverError } = await supabase
        .from('assignment_solvers')
        .select('*')
        .ilike('contact', `%${searchContact}%`)
        .single();

      if (solverError) throw solverError;
      
      if (!solver.is_verified) {
        toast.error('Your solver account is pending verification');
        return;
      }

      if (!solver.is_active) {
        toast.error('Your solver account is inactive');
        return;
      }

      setSolverData(solver);
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Error finding solver:', error);
      toast.error('Solver account not found');
    }
  };

  const { data: availableAssignments = [], refetch: refetchAvailable } = useQuery({
    queryKey: ['available-assignments', solverData?.subjects],
    queryFn: async () => {
      if (!solverData) return [];
      
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('status', 'pending')
        .in('subject', solverData.subjects)
        .order('urgency', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!solverData
  });

  const { data: myAssignments = [], refetch: refetchMy } = useQuery({
    queryKey: ['my-assignments', solverData?.id],
    queryFn: async () => {
      if (!solverData) return [];
      
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('solver_id', solverData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!solverData
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchAvailable(), refetchMy()]);
    setIsRefreshing(false);
    toast.success('Data refreshed');
  };

  const handleAcceptAssignment = async (assignmentId: string) => {
    if (!solverData) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          status: 'assigned',
          solver_id: solverData.id,
          solver_name: solverData.name
        })
        .eq('id', assignmentId);

      if (error) throw error;

      toast.success('Assignment accepted! Start working on it.');
      refetchAvailable();
      refetchMy();
    } catch (error) {
      console.error('Error accepting assignment:', error);
      toast.error('Failed to accept assignment');
    }
  };

  const handleSubmitSolution = async () => {
    if (!selectedAssignment || !solution.text.trim()) {
      toast.error('Please enter a solution');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload files if any
      const uploadedFiles = [];
      for (const file of solution.files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `solutions/${fileName}`;

        const { error } = await supabase.storage
          .from('assignment-files')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('assignment-files')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type
        });
      }

      // Create solution
      const { error: solutionError } = await supabase
        .from('assignment_solutions')
        .insert({
          assignment_id: selectedAssignment.id,
          solver_id: solverData.id,
          solver_name: solverData.name,
          solver_contact: solverData.contact,
          solution_text: solution.text,
          solution_files: uploadedFiles,
          status: 'pending'
        });

      if (solutionError) throw solutionError;

      // Update assignment status
      const { error: updateError } = await supabase
        .from('assignments')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString()
        })
        .eq('id', selectedAssignment.id);

      if (updateError) throw updateError;

      toast.success('Solution submitted for review!');
      setSelectedAssignment(null);
      setSolution({ text: '', files: [] });
      refetchMy();
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error('Failed to submit solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-purple-100 text-purple-800',
      'submitted': 'bg-orange-100 text-orange-800',
      'approved': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  // Login Screen
  if (!solverData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Solver Dashboard</CardTitle>
                <CardDescription>Enter your registered contact to access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact">Phone Number or Email</Label>
                  <Input
                    id="contact"
                    placeholder="Enter your registered contact"
                    value={searchContact}
                    onChange={(e) => setSearchContact(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSearch} className="w-full" size="lg">
                  Access Dashboard
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/ellio-notes/assignment-help/solver/register')}
                  >
                    Register as a Solver
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate('/ellio-notes/assignment-help/browse')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Browse Public Assignments
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate('/ellio-notes/assignment-help/solver/leaderboard')}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 md:py-12 pb-24 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Welcome Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {solverData.name}!</h1>
              <p className="text-muted-foreground text-sm md:text-base">Manage your assignments and earnings</p>
            </div>
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''} ${isMobile ? '' : 'mr-2'}`} />
              {!isMobile && 'Refresh'}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Total Earned</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-green-600">₹{solverData.total_earned}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">Solved</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-600">{solverData.total_solved}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-muted-foreground">Available</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-orange-600">{availableAssignments.length}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-muted-foreground">Rating</span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-purple-600">{solverData.rating || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links - Mobile */}
          {isMobile && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/ellio-notes/assignment-help/browse')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Browse All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/ellio-notes/assignment-help/solver/leaderboard')}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Leaderboard
              </Button>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="available" className="text-sm">
                Available ({availableAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="my-assignments" className="text-sm">
                My Work ({myAssignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-3 mt-4">
              {availableAssignments.map((assignment: any) => (
                <Card key={assignment.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{assignment.subject}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.class_level}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-green-100 text-green-800">
                          Earn ₹{assignment.solver_payment}
                        </Badge>
                        {assignment.urgency === 'urgent' && (
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        )}
                      </div>
                    </div>
                    
                    {assignment.assignment_text && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 bg-accent p-2 rounded">
                        {assignment.assignment_text}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(assignment.created_at), 'MMM dd, HH:mm')}
                      </span>
                      <div className="flex gap-2">
                        {isMobile ? (
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh]">
                              <SheetHeader>
                                <SheetTitle>{assignment.subject} - {assignment.class_level}</SheetTitle>
                              </SheetHeader>
                              <div className="space-y-4 mt-4">
                                {assignment.assignment_text && (
                                  <div>
                                    <p className="font-medium mb-2">Question:</p>
                                    <p className="text-sm bg-accent p-3 rounded whitespace-pre-wrap">
                                      {assignment.assignment_text}
                                    </p>
                                  </div>
                                )}
                                <div className="space-y-2">
                                  <p><span className="font-medium">Student:</span> {assignment.student_name}</p>
                                  <p><span className="font-medium">Deadline:</span> {assignment.deadline ? format(new Date(assignment.deadline), 'PPP') : 'No deadline'}</p>
                                  <p><span className="font-medium">Payment:</span> ₹{assignment.solver_payment}</p>
                                </div>
                                <Button className="w-full" onClick={() => handleAcceptAssignment(assignment.id)}>
                                  Accept Assignment
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{assignment.subject}</DialogTitle>
                                <DialogDescription>{assignment.class_level}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {assignment.assignment_text && (
                                  <div>
                                    <p className="font-medium mb-2">Question:</p>
                                    <p className="text-sm bg-accent p-3 rounded whitespace-pre-wrap">
                                      {assignment.assignment_text}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <p><span className="font-medium">Student:</span> {assignment.student_name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Deadline: {assignment.deadline ? format(new Date(assignment.deadline), 'PPP') : 'No deadline'}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button size="sm" onClick={() => handleAcceptAssignment(assignment.id)}>
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {availableAssignments.length === 0 && (
                <Card className="text-center py-12">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No available assignments</p>
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/ellio-notes/assignment-help/browse')}
                    className="mt-2"
                  >
                    Browse all public assignments
                  </Button>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="my-assignments" className="space-y-3 mt-4">
              {myAssignments.map((assignment: any) => (
                <Card key={assignment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{assignment.subject}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.student_name}</p>
                      </div>
                      <Badge className={getStatusBadge(assignment.status)}>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600">
                        ₹{assignment.solver_payment}
                      </span>
                      
                      {assignment.status === 'assigned' && (
                        isMobile ? (
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button size="sm">
                                <Upload className="w-4 h-4 mr-1" />
                                Submit
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[85vh]">
                              <SheetHeader>
                                <SheetTitle>Submit Solution</SheetTitle>
                              </SheetHeader>
                              <div className="space-y-4 mt-4 overflow-y-auto">
                                <div>
                                  <Label>Solution Text *</Label>
                                  <Textarea
                                    value={solution.text}
                                    onChange={(e) => setSolution({ ...solution, text: e.target.value })}
                                    placeholder="Type your detailed solution here..."
                                    rows={8}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label>Upload Files (Optional)</Label>
                                  <Input
                                    type="file"
                                    multiple
                                    className="mt-1"
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        setSolution({ ...solution, files: Array.from(e.target.files) });
                                      }
                                    }}
                                  />
                                </div>
                                <Button 
                                  className="w-full"
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    handleSubmitSolution();
                                  }}
                                >
                                  {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Submit Solution
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Submit Solution</DialogTitle>
                                <DialogDescription>Upload your solution for admin review</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Solution Text *</Label>
                                  <Textarea
                                    value={solution.text}
                                    onChange={(e) => setSolution({ ...solution, text: e.target.value })}
                                    placeholder="Type your detailed solution here..."
                                    rows={8}
                                  />
                                </div>
                                <div>
                                  <Label>Upload Files (Optional)</Label>
                                  <Input
                                    type="file"
                                    multiple
                                    onChange={(e) => {
                                      if (e.target.files) {
                                        setSolution({ ...solution, files: Array.from(e.target.files) });
                                      }
                                    }}
                                  />
                                </div>
                                <Button 
                                  disabled={isSubmitting}
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    handleSubmitSolution();
                                  }}
                                >
                                  {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )
                      )}
                      {assignment.status === 'submitted' && (
                        <Badge variant="outline">Pending review</Badge>
                      )}
                      {assignment.status === 'approved' && (
                        <Badge className="bg-green-100 text-green-800">
                          Payment: ₹{assignment.solver_payment}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {myAssignments.length === 0 && (
                <Card className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No assignments accepted yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Browse available assignments to get started</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SolverDashboard;