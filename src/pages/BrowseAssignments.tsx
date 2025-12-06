import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  Search, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  IndianRupee,
  AlertCircle,
  ArrowLeft,
  Users
} from 'lucide-react';
import { format } from 'date-fns';

interface Assignment {
  id: string;
  subject: string;
  class_level: string;
  assignment_type: string;
  assignment_text: string | null;
  urgency: string;
  deadline: string | null;
  solver_payment: number;
  status: string;
  created_at: string;
}

const BrowseAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchQuery, subjectFilter, classFilter]);

  const fetchAssignments = async () => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('status', 'pending')
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssignments = () => {
    let filtered = [...assignments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.subject.toLowerCase().includes(query) ||
        a.assignment_text?.toLowerCase().includes(query) ||
        a.class_level.toLowerCase().includes(query)
      );
    }

    if (subjectFilter !== 'all') {
      filtered = filtered.filter(a => a.subject === subjectFilter);
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter(a => a.class_level === classFilter);
    }

    setFilteredAssignments(filtered);
  };

  const uniqueSubjects = [...new Set(assignments.map(a => a.subject))];
  const uniqueClasses = [...new Set(assignments.map(a => a.class_level))];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'normal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const handleSolveClick = (assignmentId: string) => {
    navigate('/solver-registration', { state: { assignmentId } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/assignment-help')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assignment Help
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Browse Assignments</h1>
          </div>
          <p className="text-muted-foreground">
            View all available assignments. Register as a solver to start earning.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by subject, topic, or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredAssignments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Assignments Available</h3>
              <p className="text-muted-foreground">
                {assignments.length === 0 
                  ? "There are no pending assignments at the moment. Check back later!"
                  : "No assignments match your filters. Try adjusting your search criteria."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </p>
            
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {assignment.subject}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {assignment.class_level}
                        </Badge>
                        <Badge className={getUrgencyColor(assignment.urgency)}>
                          {assignment.urgency === 'high' ? 'Urgent' : assignment.urgency}
                        </Badge>
                        <Badge variant="secondary">{assignment.assignment_type}</Badge>
                      </div>
                      
                      <p className="text-foreground line-clamp-2">
                        {assignment.assignment_text || 'Assignment with attached files'}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Posted {format(new Date(assignment.created_at), 'MMM d, yyyy')}
                        </span>
                        {assignment.deadline && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="h-4 w-4" />
                            Due: {format(new Date(assignment.deadline), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Solver Earnings</p>
                        <p className="text-2xl font-bold text-primary flex items-center">
                          <IndianRupee className="h-5 w-5" />
                          {assignment.solver_payment}
                        </p>
                      </div>
                      
                      <Button onClick={() => handleSolveClick(assignment.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        Solve This
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA for becoming a solver */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Want to Earn by Solving Assignments?</h3>
            <p className="text-muted-foreground mb-4">
              Register as a solver and start earning by helping students with their assignments.
            </p>
            <Button onClick={() => navigate('/solver-registration')} size="lg">
              Register as Solver
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default BrowseAssignments;
