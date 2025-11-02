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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ListChecks, Clock, CheckCircle, XCircle, Download, Eye, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const MyRequests = () => {
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      toast.error('Please enter your phone number or email');
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .ilike('student_contact', `%${searchPhone}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSearchResults(data || []);
      if (!data || data.length === 0) {
        toast.info('No assignments found with this contact');
      }
    } catch (error) {
      console.error('Error searching assignments:', error);
      toast.error('Failed to search assignments');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      submitted: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'assigned':
        return <Clock className="w-4 h-4" />;
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredByStatus = (status: string) => {
    if (status === 'all') return searchResults;
    if (status === 'pending') return searchResults.filter(a => a.status === 'pending' || a.status === 'assigned');
    if (status === 'in_progress') return searchResults.filter(a => a.status === 'in_progress' || a.status === 'submitted');
    if (status === 'completed') return searchResults.filter(a => a.status === 'approved' || a.status === 'completed');
    return searchResults;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <ListChecks className="w-10 h-10 text-green-600" />
              My Assignment Requests
            </h1>
            <p className="text-gray-600">Track your assignments and download solutions</p>
          </div>

          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Find Your Assignments</CardTitle>
              <CardDescription>Enter your phone number or email to view your assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Phone Number or Email</Label>
                  <Input
                    id="search"
                    placeholder="Enter your contact details"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                    <Search className="w-4 h-4" />
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {searchResults.length > 0 && (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({searchResults.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({filteredByStatus('pending').length})
                </TabsTrigger>
                <TabsTrigger value="in_progress">
                  In Progress ({filteredByStatus('in_progress').length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({filteredByStatus('completed').length})
                </TabsTrigger>
              </TabsList>

              {['all', 'pending', 'in_progress', 'completed'].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-4 mt-6">
                  {filteredByStatus(tab).map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">
                              {assignment.subject} - {assignment.class_level}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {assignment.assignment_type === 'text' ? 'Text Question' : 'File Upload'}
                              {assignment.urgency === 'urgent' && (
                                <Badge variant="destructive" className="ml-2">Urgent</Badge>
                              )}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(assignment.status)}
                              {assignment.status.replace('_', ' ')}
                            </span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {assignment.assignment_text && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {assignment.assignment_text.substring(0, 200)}
                                {assignment.assignment_text.length > 200 && '...'}
                              </p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Submitted</p>
                              <p className="font-medium">{format(new Date(assignment.created_at), 'MMM dd, yyyy')}</p>
                            </div>
                            {assignment.solver_name && (
                              <div>
                                <p className="text-gray-500">Assigned to</p>
                                <p className="font-medium">{assignment.solver_name}</p>
                              </div>
                            )}
                            {assignment.deadline && (
                              <div>
                                <p className="text-gray-500">Deadline</p>
                                <p className="font-medium">{format(new Date(assignment.deadline), 'MMM dd, yyyy')}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-gray-500">Amount</p>
                              <p className="font-medium text-green-600">₹{assignment.total_fee}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {assignment.payment_status}
                              </Badge>
                            </div>
                          </div>

                          {(assignment.status === 'approved' || assignment.status === 'completed') && (
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="w-4 h-4" />
                                View Solution
                              </Button>
                              <Button size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredByStatus(tab).length === 0 && (
                    <Card className="text-center py-12">
                      <p className="text-gray-500">No assignments in this category</p>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default MyRequests;