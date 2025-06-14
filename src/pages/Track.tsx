
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Package, Clock, CheckCircle, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Track = () => {
  const [trackingId, setTrackingId] = useState('');
  const [job, setJob] = useState<PrintJob | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      setNotFound(true);
      setJob(null);
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setJob(null);

    try {
      console.log('Searching for tracking ID:', trackingId.trim());
      
      const { data, error } = await supabase
        .from('print_jobs')
        .select('*')
        .eq('tracking_id', trackingId.trim())
        .maybeSingle();

      if (error) {
        console.error('Error searching for job:', error);
        toast({
          title: "Search Error",
          description: "There was an error searching for your order. Please try again.",
          variant: "destructive"
        });
        setNotFound(true);
        return;
      }
      
      if (data) {
        console.log('Job found:', data);
        
        // Handle files - ensure it's properly typed
        let files: Array<{ name: string; size: number; type: string }> = [];
        if (Array.isArray(data.files)) {
          files = data.files.map((file: any) => ({
            name: file.name || 'Unknown file',
            size: file.size || 0,
            type: file.type || 'unknown'
          }));
        }

        // Ensure status is properly typed
        const validStatuses = ['pending', 'pending_payment', 'printing', 'ready', 'completed'] as const;
        const status = validStatuses.includes(data.status as any) ? data.status as PrintJob['status'] : 'pending';

        setJob({
          id: data.id,
          tracking_id: data.tracking_id,
          name: data.name,
          phone: data.phone,
          institute: data.institute || '',
          time_slot: data.time_slot,
          notes: data.notes || '',
          files,
          timestamp: data.timestamp,
          status,
          selected_services: data.selected_services || [],
          total_amount: data.total_amount || 0,
          delivery_requested: data.delivery_requested || false
        });
        setNotFound(false);
      } else {
        console.log('No job found');
        setJob(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error searching for job:', error);
      toast({
        title: "Search Error",
        description: "There was an error searching for your order. Please try again.",
        variant: "destructive"
      });
      setJob(null);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'pending_payment': return <CreditCard className="w-5 h-5 text-orange-600" />;
      case 'printing': return <Package className="w-5 h-5 text-blue-600" />;
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'completed': return <Truck className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'pending_payment': return 'bg-orange-100 text-orange-800';
      case 'printing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your order has been received and is waiting to be processed.';
      case 'pending_payment': return 'Please complete payment to process your order.';
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
            <p className="text-gray-600">Enter your phone number to check the status of your print job</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Your Phone Number</CardTitle>
              <CardDescription>
                Use the phone number you provided when submitting your print job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tracking">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="tracking"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your phone number"
                    className="font-mono"
                  />
                  <Button onClick={handleTrack} disabled={isSearching}>
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? 'Searching...' : 'Track'}
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
                  <p>Please check your phone number and try again.</p>
                  <p className="text-sm mt-2 text-gray-500">
                    Make sure to enter the same phone number you used when submitting your order.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {job && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Order Details</CardTitle>
                      <CardDescription>Phone Number: {job.tracking_id}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(job.status)}>
                      {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.replace('_', ' ').slice(1)}
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
                        <p><span className="font-medium">Pickup Time:</span> {job.time_slot}</p>
                        {job.delivery_requested && (
                          <Badge className="bg-green-100 text-green-800">
                            🚚 Delivery Requested
                          </Badge>
                        )}
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

                  {/* Services and Pricing */}
                  {job.selected_services && job.selected_services.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Selected Services</h4>
                      <div className="space-y-2">
                        {job.selected_services.map((service: any, index) => (
                          <div key={index} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                            <span>{service.name} (x{service.quantity})</span>
                            <span className="font-medium">₹{service.price?.toFixed(2) || '0.00'}</span>
                          </div>
                        ))}
                        {job.total_amount && (
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total Amount:</span>
                            <span className="text-blue-600">₹{job.total_amount.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Track;
