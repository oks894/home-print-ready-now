import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, FileText, Clock } from 'lucide-react';

interface Solution {
  id: string;
  assignment_id: string;
  solver_name: string;
  solver_contact: string;
  solution_text: string;
  solution_files: any;
  submitted_at: string;
  status: string;
  admin_notes: string;
  assignments: {
    student_name: string;
    subject: string;
    assignment_text: string;
    assignment_files: any;
    urgency: string;
    total_fee: number;
  };
}

export const AssignmentPendingVerification = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingSolutions();
  }, []);

  const fetchPendingSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('assignment_solutions')
        .select(`
          *,
          assignments (
            student_name,
            subject,
            assignment_text,
            assignment_files,
            urgency,
            total_fee
          )
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSolutions(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load pending solutions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (solutionId: string, assignmentId: string) => {
    try {
      // Update solution status
      const { error: solutionError } = await supabase
        .from('assignment_solutions')
        .update({ 
          status: 'approved',
          admin_notes: adminNotes[solutionId] || 'Approved by admin'
        })
        .eq('id', solutionId);

      if (solutionError) throw solutionError;

      // Update assignment status
      const { error: assignmentError } = await supabase
        .from('assignments')
        .update({ 
          status: 'completed',
          approved_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (assignmentError) throw assignmentError;

      // Update transaction status
      const { error: transactionError } = await supabase
        .from('assignment_transactions')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('assignment_id', assignmentId);

      if (transactionError) throw transactionError;

      toast({
        title: 'Success',
        description: 'Solution approved and payment released',
      });

      fetchPendingSolutions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve solution',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (solutionId: string, assignmentId: string) => {
    if (!adminNotes[solutionId]) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Update solution status
      const { error: solutionError } = await supabase
        .from('assignment_solutions')
        .update({ 
          status: 'rejected',
          admin_notes: adminNotes[solutionId]
        })
        .eq('id', solutionId);

      if (solutionError) throw solutionError;

      // Update assignment status back to assigned
      const { error: assignmentError } = await supabase
        .from('assignments')
        .update({ status: 'assigned' })
        .eq('id', assignmentId);

      if (assignmentError) throw assignmentError;

      toast({
        title: 'Solution Rejected',
        description: 'Solver has been notified',
      });

      fetchPendingSolutions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject solution',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading pending solutions...</div>;
  }

  if (solutions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No pending solutions to review</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {solutions.map((solution) => (
        <Card key={solution.id} className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {solution.assignments.subject}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{solution.assignments.urgency}</Badge>
                  <Badge variant="secondary">₹{solution.assignments.total_fee}</Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(solution.submitted_at).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Question */}
            <div>
              <h4 className="font-semibold mb-2">Student: {solution.assignments.student_name}</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{solution.assignments.assignment_text}</p>
                {solution.assignments.assignment_files?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {solution.assignments.assignment_files.map((file: any, idx: number) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        📎 {file.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Solver Solution */}
            <div>
              <h4 className="font-semibold mb-2">Solver: {solution.solver_name}</h4>
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm whitespace-pre-wrap">{solution.solution_text}</p>
                {solution.solution_files?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {solution.solution_files.map((file: any, idx: number) => (
                      <a
                        key={idx}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        📎 {file.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Notes</label>
              <Textarea
                placeholder="Add notes or feedback (required for rejection)..."
                value={adminNotes[solution.id] || ''}
                onChange={(e) =>
                  setAdminNotes({ ...adminNotes, [solution.id]: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(solution.id, solution.assignment_id)}
                className="flex-1"
                variant="default"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve & Release Payment
              </Button>
              <Button
                onClick={() => handleReject(solution.id, solution.assignment_id)}
                className="flex-1"
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Request Revision
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
