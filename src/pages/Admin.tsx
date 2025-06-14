
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Trash2, FileText, Clock, User, Phone, Building, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface PrintJob {
  id: string;
  trackingId?: string;
  name: string;
  phone: string;
  institute: string;
  timeSlot: string;
  notes: string;
  files: Array<{ name: string; size: number; type: string; data?: string }>;
  timestamp: string;
  status: 'pending' | 'printing' | 'ready' | 'completed';
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  service: string;
  comments: string;
  rating: number;
  timestamp: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadPrintJobs();
      loadFeedback();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '000000') {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Invalid password",
        description: "Please enter the correct password",
        variant: "destructive"
      });
    }
  };

  const loadPrintJobs = () => {
    const jobs = JSON.parse(localStorage.getItem('printJobs') || '[]');
    setPrintJobs(jobs.sort((a: PrintJob, b: PrintJob) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const loadFeedback = () => {
    const feedbackData = JSON.parse(localStorage.getItem('feedback') || '[]');
    setFeedback(feedbackData.sort((a: Feedback, b: Feedback) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const updateJobStatus = (jobId: string, status: PrintJob['status']) => {
    const updatedJobs = printJobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    );
    setPrintJobs(updatedJobs);
    localStorage.setItem('printJobs', JSON.stringify(updatedJobs));
    toast({
      title: "Status updated",
      description: `Job status changed to ${status}`,
    });
  };

  const deleteJob = (jobId: string) => {
    const updatedJobs = printJobs.filter(job => job.id !== jobId);
    setPrintJobs(updatedJobs);
    localStorage.setItem('printJobs', JSON.stringify(updatedJobs));
    setSelectedJob(null);
    toast({
      title: "Job deleted",
      description: "Print job has been removed",
    });
  };

  const deleteFeedback = (feedbackId: string) => {
    const updatedFeedback = feedback.filter(f => f.id !== feedbackId);
    setFeedback(updatedFeedback);
    localStorage.setItem('feedback', JSON.stringify(updatedFeedback));
    toast({
      title: "Feedback deleted",
      description: "Feedback has been removed",
    });
  };

  const downloadFile = (fileName: string, fileData?: string) => {
    if (fileData) {
      // Create a proper download link from base64 data
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${fileName}`,
      });
    } else {
      toast({
        title: "File not available",
        description: "This file cannot be downloaded",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'printing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter the admin password to access the panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center">
                <Link to="/" className="text-sm text-blue-600 hover:underline">
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticated(false)}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">Print Jobs ({printJobs.length})</TabsTrigger>
            <TabsTrigger value="feedback">Feedback ({feedback.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Jobs List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Print Jobs ({printJobs.length})</CardTitle>
                    <CardDescription>
                      Manage and track all print job requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {printJobs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No print jobs yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {printJobs.map((job) => (
                          <div
                            key={job.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedJob?.id === job.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedJob(job)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold">{job.name}</h3>
                                <p className="text-sm text-gray-600">{job.phone}</p>
                                {job.institute && (
                                  <p className="text-sm text-gray-500">{job.institute}</p>
                                )}
                                {job.trackingId && (
                                  <p className="text-xs text-blue-600 font-mono">{job.trackingId}</p>
                                )}
                              </div>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {job.files.length} files
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.timeSlot}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Job Details */}
              <div>
                {selectedJob ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                      <CardDescription>
                        Submitted on {new Date(selectedJob.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Customer Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{selectedJob.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{selectedJob.phone}</span>
                        </div>
                        {selectedJob.institute && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span>{selectedJob.institute}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{selectedJob.timeSlot}</span>
                        </div>
                        {selectedJob.trackingId && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="font-mono text-sm">{selectedJob.trackingId}</span>
                          </div>
                        )}
                      </div>

                      {/* Files */}
                      <div>
                        <h4 className="font-medium mb-2">Files to Print</h4>
                        <div className="space-y-2">
                          {selectedJob.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium text-sm">{file.name}</div>
                                <div className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => downloadFile(file.name, file.data)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {selectedJob.notes && (
                        <div>
                          <h4 className="font-medium mb-2">Special Instructions</h4>
                          <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                            {selectedJob.notes}
                          </p>
                        </div>
                      )}

                      {/* Status Update */}
                      <div>
                        <Label>Update Status</Label>
                        <Select
                          value={selectedJob.status}
                          onValueChange={(value) => updateJobStatus(selectedJob.id, value as PrintJob['status'])}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="printing">Printing</SelectItem>
                            <SelectItem value="ready">Ready for Pickup</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteJob(selectedJob.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a print job to view details</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback ({feedback.length})</CardTitle>
                <CardDescription>
                  Review customer feedback and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {feedback.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No feedback yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedback.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.email}</p>
                            {item.service && (
                              <p className="text-sm text-gray-500">Service: {item.service}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= item.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteFeedback(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {item.comments && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {item.comments}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Submitted on {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
