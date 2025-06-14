
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Package, Clock, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PrintJob {
  id: string;
  trackingId: string;
  name: string;
  phone: string;
  institute: string;
  timeSlot: string;
  notes: string;
  files: Array<{ name: string; size: number; type: string }>;
  timestamp: string;
  status: 'pending' | 'printing' | 'ready' | 'completed';
}

const Track = () => {
  const [trackingId, setTrackingId] = useState('');
  const [job, setJob] = useState<PrintJob | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = () => {
    const jobs = JSON.parse(localStorage.getItem('printJobs') || '[]');
    const foundJob = jobs.find((j: PrintJob) => j.trackingId === trackingId.trim());
    
    if (foundJob) {
      setJob(foundJob);
      setNotFound(false);
    } else {
      setJob(null);
      setNotFound(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'printing': return <Package className="w-5 h-5 text-blue-600" />;
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'completed': return <Truck className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been received and is waiting to be processed.';
      case 'printing': return 'Your documents are currently being printed.';
      case 'ready': return 'Your order is ready for pickup!';
      case 'completed': return 'Your order has been completed and delivered.';
      default: return 'Status unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Enter your tracking ID to check the status of your print job</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking ID</CardTitle>
              <CardDescription>
                Use the tracking ID provided when you submitted your print job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tracking">Tracking ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter tracking ID (e.g., PR12345678)"
                    className="font-mono"
                  />
                  <Button onClick={handleTrack}>
                    <Search className="w-4 h-4 mr-2" />
                    Track
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {notFound && (
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
                  <p>Please check your tracking ID and try again.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {job && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Tracking ID: {job.trackingId}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  {getStatusIcon(job.status)}
                  <div>
                    <h4 className="font-semibold">Current Status</h4>
                    <p className="text-sm text-gray-600">{getStatusMessage(job.status)}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {job.name}</p>
                      <p><span className="font-medium">Phone:</span> {job.phone}</p>
                      {job.institute && (
                        <p><span className="font-medium">Institute:</span> {job.institute}</p>
                      )}
                      <p><span className="font-medium">Pickup Time:</span> {job.timeSlot}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Files ({job.files.length})</h4>
                    <div className="space-y-2">
                      {job.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span>{file.name}</span>
                          <span className="text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {job.notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Special Instructions</h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                      {job.notes}
                    </p>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <p>Order submitted on: {new Date(job.timestamp).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Track;
