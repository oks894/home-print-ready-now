
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, Clock, Settings, CheckCircle, ArrowRight, ArrowLeft, Package, Truck, CreditCard, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from './FileUpload';
import { ServiceSelector } from './ServiceSelector';
import CustomerForm from './CustomerForm';
import TimeSlotSelector from './TimeSlotSelector';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import { useToast } from '@/hooks/use-toast';

interface PrintJobFormProps {
  onOrderSubmitted: (trackingId: string) => void;
}

const PrintJobForm = ({ onOrderSubmitted }: PrintJobFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [canAccessDelivery, setCanAccessDelivery] = useState(false);
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    institute: '',
    timeSlot: '',
    notes: ''
  });

  const { submitPrintJob, isSubmitting } = usePrintJobSubmission();
  const { toast } = useToast();

  const steps = [
    { 
      id: 'upload', 
      title: 'Upload Files', 
      icon: FileText, 
      description: 'Upload your documents',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'services', 
      title: 'Select Services', 
      icon: Settings, 
      description: 'Choose printing options',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'info', 
      title: 'Your Details', 
      icon: User, 
      description: 'Contact information',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'schedule', 
      title: 'Schedule', 
      icon: Clock, 
      description: 'Pick up time',
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'review', 
      title: 'Review & Submit', 
      icon: CheckCircle, 
      description: 'Confirm your order',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return files.length > 0;
      case 1: return selectedServices.length > 0;
      case 2: return formData.name && formData.phone;
      case 3: return formData.timeSlot;
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    try {
      const trackingId = await submitPrintJob(
        formData,
        files,
        selectedServices,
        totalAmount,
        deliveryRequested,
        canAccessDelivery
      );
      
      if (trackingId) {
        onOrderSubmitted(trackingId);
        
        // Reset form
        setCurrentStep(0);
        setFiles([]);
        setSelectedServices([]);
        setFormData({
          name: '',
          phone: '',
          institute: '',
          timeSlot: '',
          notes: ''
        });
        setDeliveryRequested(false);
      }
    } catch (error) {
      console.error('Error submitting print job:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your print job. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    setCanAccessDelivery(totalAmount >= 200);
  }, [totalAmount]);

  // Helper function to calculate price from service
  const calculateServicePrice = (service: any) => {
    // Parse the price string (e.g., "₹3.5/page" -> 3.5)
    const priceMatch = service.price.match(/₹?(\d+(?:\.\d+)?)/);
    return priceMatch ? parseFloat(priceMatch[1]) : 0;
  };

  useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + service.calculatedPrice, 0);
    setTotalAmount(total);
  }, [selectedServices]);

  const stepVariants = {
    hidden: { opacity: 0, x: 100, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.95 }
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
              >
                <FileText className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Upload Your Documents
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Drag and drop your files or click to browse. We support PDF, DOC, DOCX, and image formats.
              </p>
            </div>
            
            <FileUpload 
              files={files} 
              onFilesChange={setFiles}
            />
            
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-blue-900">
                    {files.length} file{files.length > 1 ? 's' : ''} ready for printing
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Total size: {(files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </motion.div>
            )}
          </motion.div>
        );

      case 1:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
              >
                <Settings className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Choose Your Services
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Select the printing options that best suit your needs. Bulk discounts apply automatically.
              </p>
            </div>
            
            <ServiceSelector 
              services={[]}
              selectedServices={selectedServices}
              onAddService={(service, quantity = 1) => {
                const basePrice = calculateServicePrice(service);
                const newService = { ...service, quantity, calculatedPrice: basePrice * quantity };
                setSelectedServices([...selectedServices, newService]);
              }}
              onUpdateQuantity={(serviceId, quantity) => {
                setSelectedServices(services => 
                  services.map(s => s.id === serviceId ? { ...s, quantity, calculatedPrice: calculateServicePrice(s) * quantity } : s)
                );
              }}
              onRemoveService={(serviceId) => {
                setSelectedServices(services => services.filter(s => s.id !== serviceId));
              }}
              totalAmount={totalAmount}
              canAccessDelivery={canAccessDelivery}
            />
            
            {selectedServices.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-purple-900">Order Summary</h4>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{service.name} (x{service.quantity})</span>
                      <span className="font-medium">₹{service.calculatedPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-purple-900">Total Amount:</span>
                  <span className="text-2xl font-bold text-purple-600">₹{totalAmount.toFixed(2)}</span>
                </div>
                
                {canAccessDelivery && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2"
                  >
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      🎉 Free delivery available for orders above ₹200!
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div variants={stepVariants}>
            <div className="text-center space-y-4 mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
              >
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Information
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We need your contact details to notify you when your order is ready and for delivery coordination.
              </p>
            </div>
            
            <CustomerForm 
              formData={formData} 
              onFormDataChange={setFormData}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
              >
                <Clock className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Schedule Pickup
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Choose when you'd like to collect your printed documents.
              </p>
            </div>
            
            <TimeSlotSelector 
              timeSlot={formData.timeSlot}
              notes={formData.notes}
              onTimeSlotChange={(slot) => setFormData({...formData, timeSlot: slot})}
              onNotesChange={(notes) => setFormData({...formData, notes})}
            />
            
            {canAccessDelivery && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-900">Delivery Option</h4>
                  <Badge className="bg-green-100 text-green-800">FREE</Badge>
                </div>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={deliveryRequested}
                    onChange={(e) => setDeliveryRequested(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-blue-800">
                    I want my order delivered to my address (Free for orders above ₹200)
                  </span>
                </label>
                
                {deliveryRequested && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 text-sm text-blue-700"
                  >
                    📞 Our delivery partner will call you to confirm the delivery address and time.
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div variants={stepVariants} className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Review Your Order
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Please review all details before submitting your print job.
              </p>
            </div>
            
            <div className="grid gap-6">
              {/* Order Summary */}
              <Card className="border-2 border-indigo-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-semibold mb-2">Files ({files.length})</h5>
                    <div className="space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="truncate">{file.name}</span>
                          <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h5 className="font-semibold mb-2">Services</h5>
                    <div className="space-y-2">
                      {selectedServices.map((service, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{service.name} (x{service.quantity})</span>
                          <span className="font-medium">₹{service.calculatedPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-indigo-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Customer Details */}
              <Card className="border-2 border-green-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-green-600" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p>{formData.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p>{formData.phone}</p>
                    </div>
                    {formData.institute && (
                      <div className="col-span-2">
                        <span className="font-medium">Institute:</span>
                        <p>{formData.institute}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="font-medium">Pickup Time:</span>
                      <p>{formData.timeSlot}</p>
                    </div>
                    {deliveryRequested && (
                      <div className="col-span-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          <Truck className="w-4 h-4 mr-1" />
                          Delivery Requested
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Info */}
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-yellow-600" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Payment will be collected upon pickup or delivery</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    We accept cash, UPI, and card payments
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Submit Your Print Job
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional printing made simple. Upload, customize, and get your documents printed with premium quality.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center relative"
              >
                <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep 
                    ? `bg-gradient-to-br ${step.color} text-white shadow-lg scale-110` 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <step.icon className="w-8 h-8" />
                  {index < currentStep && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                
                <div className="text-center mt-3 max-w-24">
                  <h4 className={`text-sm font-semibold ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`absolute top-8 left-20 w-20 h-0.5 transition-colors duration-300 ${
                    index < currentStep ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm font-medium text-purple-600">{Math.round(progress)}% Complete</span>
          </div>
        </motion.div>

        {/* Step Content */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}
                transition={{ duration: 0.3 }}
              >
                {getCurrentStepComponent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 h-12 px-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </Button>
          
          <div className="flex gap-4">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next Step
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    Submit Order
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrintJobForm;
