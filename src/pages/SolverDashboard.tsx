import { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, TrendingUp, DollarSign, Clock, Upload, FileText, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const SolverDashboard = () => {
  const [searchContact, setSearchContact] = useState('');
  const [solverData, setSolverData] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [solution, setSolution] = useState({ text: '', files: [] as File[] });

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
      toast.success('Solver account found!');
    } catch (error) {
      console.error('Error finding solver:', error);
      toast.error('Solver account not found');
    }
  };

  const { data: availableAssignments = [] } = useQuery({
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

  const { data: myAssignments = [] } = useQuery({
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
      window.location.reload();
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
      window.location.reload();
    } catch (error) {
      console.error('Error submitting solution:', error);
      toast.error('Failed to submit solution');
    }
  };

  if (!solverData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Users className="w-8 h-8 text-orange-600" />
                  Solver Dashboard
                </CardTitle>
                <CardDescription>Enter your registered contact to access the dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contact">Phone Number or Email</Label>
                    <Input
                      id="contact"
                      placeholder="Enter your registered contact"
                      value={searchContact}
                      onChange={(e) => setSearchContact(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} className="w-full">
                    Access Dashboard
                  </Button>
                  <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/ellio-notes/assignment-help/solver/register" className="text-blue-600 hover:underline">
                      Register as a Solver
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {solverData.name}!</h1>
            <p className="text-gray-600">Manage your assignments and earnings</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{solverData.total_solved}</div>
                <p className="text-xs text-muted-foreground">assignments completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{solverData.total_earned}</div>
                <p className="text-xs text-muted-foreground">from completed assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{availableAssignments.length}</div>
                <p className="text-xs text-muted-foreground">new assignments</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">
                Available Assignments ({availableAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="my-assignments">
                My Assignments ({myAssignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-4 mt-6">
              {availableAssignments.map((assignment: any) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.subject} - {assignment.class_level}</CardTitle>
                        <CardDescription>
                          Posted {format(new Date(assignment.created_at), 'MMM dd, HH:mm')}
                          {assignment.urgency === 'urgent' && (
                            <Badge variant="destructive" className="ml-2">Urgent</Badge>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Earn ₹{assignment.solver_payment}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assignment.assignment_text && (
                      <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                        {assignment.assignment_text.substring(0, 200)}...
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
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
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                                  {assignment.assignment_text}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">Student: {assignment.student_name}</p>
                              <p className="text-sm text-gray-600">Deadline: {assignment.deadline ? format(new Date(assignment.deadline), 'PPP') : 'No deadline'}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" onClick={() => handleAcceptAssignment(assignment.id)}>
                        Accept Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {availableAssignments.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-gray-500">No available assignments at the moment</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="my-assignments" className="space-y-4 mt-6">
              {myAssignments.map((assignment: any) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assignment.subject} - {assignment.class_level}</CardTitle>
                        <CardDescription>
                          Student: {assignment.student_name}
                        </CardDescription>
                      </div>
                      <Badge>{assignment.status.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {assignment.status === 'assigned' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
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
                            <Button onClick={() => {
                              setSelectedAssignment(assignment);
                              handleSubmitSolution();
                            }}>
                              Submit Solution
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {assignment.status === 'submitted' && (
                      <Badge variant="outline">Pending admin review</Badge>
                    )}
                    {assignment.status === 'approved' && (
                      <Badge className="bg-green-100 text-green-800">
                        Payment Released: ₹{assignment.solver_payment}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {myAssignments.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-gray-500">You haven't accepted any assignments yet</p>
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