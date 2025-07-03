import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Package, Clock, CheckCircle, Truck, CreditCard, Phone, User, MapPin, Calendar, FileText, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
        
        // Handle files - ensure it's properly typed and handle Json type
        let files: Array<{ name: string; size: number; type: string }> = [];
        if (data.files && Array.isArray(data.files)) {
          files = (data.files as any[]).map((file: any) => ({
            name: file.name || 'Unknown file',
            size: file.size || 0,
            type: file.type || 'unknown'
          }));
        }

        // Ensure status is properly typed with fallback
        const validStatuses = ['pending', 'pending_payment', 'printing', 'ready', 'completed'] as const;
        const status = validStatuses.includes(data.status as any) ? 
          data.status as PrintJob['status'] : 'pending';

        // Handle selected services with proper typing
        let selectedServices: Array<{ id: string; name: string; quantity: number; price: number }> = [];
        if (data.selected_services && Array.isArray(data.selected_services)) {
          selectedServices = data.selected_services as any[];
        }

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
          selected_services: selectedServices,
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
      case 'pending': return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'pending_payment': return <CreditCard className="w-6 h-6 text-orange-600" />;
      case 'printing': return <Package className="w-6 h-6 text-blue-600" />;
      case 'ready': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'completed': return <Truck className="w-6 h-6 text-gray-600" />;
      default: return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'pending_payment': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      case 'printing': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'ready': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'completed': return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getStatusMessage = (status: string, estimatedCompletion?: string) => {
    const baseMessages = {
      'pending': 'Your order has been received and is waiting to be processed. We\'ll call you shortly to confirm details.',
      'pending_payment': 'Please complete payment to process your order. Our team will contact you with payment details.',
      'printing': 'Great news! Your documents are currently being printed with premium quality materials.',
      'ready': '🎉 Your order is ready for pickup! Please collect it at your scheduled time or wait for delivery.',
      'completed': '✅ Your order has been completed and delivered. Thank you for choosing our services!',
      'default': 'Status information is being updated...'
    };

    let message = baseMessages[status as keyof typeof baseMessages] || baseMessages.default;
    
    if (estimatedCompletion && (status === 'printing' || status === 'pending')) {
      const completionDate = new Date(estimatedCompletion);
      message += ` Estimated completion: ${completionDate.toLocaleDateString()} at ${completionDate.toLocaleTimeString()}.`;
    }
    
    return message;
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 20;
      case 'pending_payment': return 40;
      case 'printing': return 60;
      case 'ready': return 80;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      <Header />
      
      <div className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-6 hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Track Your Order
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Enter your phone number to check the real-time status of your print job
              </p>
            </div>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  Enter Your Phone Number
                </CardTitle>
                <CardDescription className="text-base">
                  Use the same phone number you provided when submitting your print job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="tracking" className="text-sm font-semibold mb-2 block">Phone Number</Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="tracking"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your phone number"
                        className="h-12 text-base border-2 focus:border-blue-500 transition-colors pl-4"
                      />
                    </div>
                    <Button 
                      onClick={handleTrack} 
                      disabled={isSearching}
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isSearching ? (
                        <>
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Track Order
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {notFound && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="border-2 border-red-200 bg-red-50">
                  <CardContent className="pt-8 pb-8">
                    <div className="text-center text-red-600">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-3">Order Not Found</h3>
                      <p className="mb-2">Please check your phone number and try again.</p>
                      <p className="text-sm text-gray-600">
                        Make sure to enter the exact same phone number you used when submitting your order.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {job && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Status Card */}
                <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  <div className={`h-2 ${getStatusColor(job.status)}`}></div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">Order Status</CardTitle>
                        <CardDescription className="text-base">
                          Phone: {job.tracking_id} • Submitted: {new Date(job.timestamp).toLocaleDateString()}
                          {job.estimated_completion && (
                            <> • Est. Completion: {new Date(job.estimated_completion).toLocaleDateString()}</>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className={`text-base px-4 py-2 border-2 ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ').charAt(0).toUpperCase() + job.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Progress</span>
                        <span>{getProgressPercentage(job.status)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage(job.status)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="flex-shrink-0">
                        {getStatusIcon(job.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Current Status</h4>
                        <p className="text-gray-700">{getStatusMessage(job.status, job.estimated_completion)}</p>
                      </div>
                    </div>

                    {/* Estimated Completion Alert */}
                    {job.estimated_completion && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-600" />
                          <div>
                            <h5 className="font-semibold text-green-800">Estimated Completion</h5>
                            <p className="text-sm text-green-700">
                              Your order is expected to be completed by{' '}
                              <strong>{new Date(job.estimated_completion).toLocaleDateString()}</strong>{' '}
                              at <strong>{new Date(job.estimated_completion).toLocaleTimeString()}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="font-semibold">{job.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="font-semibold">{job.phone}</p>
                          </div>
                        </div>
                        {job.institute && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Institute</p>
                              <p className="font-semibold">{job.institute}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Pickup Time</p>
                            <p className="font-semibold">{job.time_slot}</p>
                          </div>
                        </div>
                        {job.delivery_requested && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <Badge className="bg-green-100 text-green-800">
                              <Truck className="w-4 h-4 mr-1" />
                              Delivery Requested
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Files and Services */}
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        Order Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Files */}
                      <div>
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          Files ({job.files.length})
                          <Badge variant="secondary">{job.files.length}</Badge>
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {job.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="truncate font-medium">{file.name}</span>
                              </div>
                              <span className="text-gray-500 text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Services and Pricing */}
                      {job.selected_services && job.selected_services.length > 0 && (
                        <div>
                          <h5 className="font-semibold mb-3 flex items-center gap-2">
                            Services
                            <Badge variant="secondary">{job.selected_services.length}</Badge>
                          </h5>
                          <div className="space-y-3">
                            {job.selected_services.map((service, index) => (
                              <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <div>
                                  <span className="font-medium">{service.name}</span>
                                  <span className="text-gray-500 text-sm ml-2">(x{service.quantity})</span>
                                </div>
                                <span className="font-bold text-blue-600">₹{service.price?.toFixed(2) || '0.00'}</span>
                              </div>
                            ))}
                            {job.total_amount && job.total_amount > 0 && (
                              <>
                                <Separator />
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                                  <span className="text-lg font-bold">Total Amount:</span>
                                  <span className="text-2xl font-bold text-green-600">₹{job.total_amount.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Special Instructions */}
                {job.notes && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Star className="w-5 h-5 text-purple-600" />
                          </div>
                          Special Instructions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-gray-700">{job.notes}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Track;
