
import { useState } from 'react';
import { Printer, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useServices } from '@/hooks/useServices';
import { useServiceSelection } from '@/hooks/useServiceSelection';
import { usePrintJobSubmission } from '@/hooks/usePrintJobSubmission';
import CustomerForm from '@/components/CustomerForm';
import FileUpload from '@/components/FileUpload';
import TimeSlotSelector from '@/components/TimeSlotSelector';
import { ServiceSelector } from '@/components/ServiceSelector';

interface PrintJobFormProps {
  onOrderSubmitted: (trackingId: string) => void;
}

const PrintJobForm = ({ onOrderSubmitted }: PrintJobFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    institute: '',
    timeSlot: '',
    notes: ''
  });
  const [deliveryRequested, setDeliveryRequested] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { services } = useServices();
  const {
    selectedServices,
    addService,
    removeService,
    updateQuantity,
    totalAmount,
    canAccessDelivery,
    clearSelection
  } = useServiceSelection(services);

  const { isSubmitting, submitPrintJob } = usePrintJobSubmission();

  const steps = [
    { id: 1, name: 'Information', icon: FileText, description: 'Your details & files' },
    { id: 2, name: 'Services', icon: CheckCircle, description: 'Select print services' },
    { id: 3, name: 'Schedule', icon: Clock, description: 'Choose pickup time' },
    { id: 4, name: 'Review', icon: Printer, description: 'Confirm & submit' }
  ];

  const getStepProgress = () => {
    const step1Complete = formData.name && formData.phone && files.length > 0;
    const step2Complete = selectedServices.length > 0;
    const step3Complete = formData.timeSlot;
    
    if (step3Complete) return 100;
    if (step2Complete) return 75;
    if (step1Complete) return 50;
    return 25;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.phone && files.length > 0;
      case 2:
        return selectedServices.length > 0;
      case 3:
        return formData.timeSlot;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      institute: '',
      timeSlot: '',
      notes: ''
    });
    setFiles([]);
    setDeliveryRequested(false);
    setCurrentStep(1);
    clearSelection();
  };

  const nextStep = () => {
    if (canProceedToNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Printer className="w-4 h-4" />
            Professional Print Service
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Submit Your Print Job
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience seamless printing with our advanced order system. Fast, reliable, and professional.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${isActive ? 'bg-blue-600 text-white shadow-lg' : 
                      isCompleted ? 'bg-green-500 text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                  <span className="text-xs text-gray-400 text-center px-2">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step Content */}
          {currentStep === 1 && (
            <div className="grid lg:grid-cols-2 gap-8">
              <CustomerForm 
                formData={formData} 
                onFormDataChange={setFormData}
              />
              <FileUpload 
                files={files} 
                onFilesChange={setFiles}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <ServiceSelector
                services={services}
                selectedServices={selectedServices}
                onAddService={addService}
                onUpdateQuantity={updateQuantity}
                onRemoveService={removeService}
                totalAmount={totalAmount}
                canAccessDelivery={canAccessDelivery}
              />
              
              {canAccessDelivery && (
                <Card className="mt-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="delivery"
                        checked={deliveryRequested}
                        onChange={(e) => setDeliveryRequested(e.target.checked)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <label htmlFor="delivery" className="text-green-800 font-medium flex-1">
                        Request free doorstep delivery (Order ₹200+)
                      </label>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        FREE
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <TimeSlotSelector
              timeSlot={formData.timeSlot}
              notes={formData.notes}
              onTimeSlotChange={(timeSlot) => setFormData(prev => ({ ...prev, timeSlot }))}
              onNotesChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
            />
          )}

          {currentStep === 4 && (
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Review Your Order</CardTitle>
                <CardDescription className="text-center">
                  Please review all details before submitting your print job
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {formData.name}</p>
                      <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                      {formData.institute && (
                        <p><span className="font-medium">Institute:</span> {formData.institute}</p>
                      )}
                      <p><span className="font-medium">Pickup Time:</span> {formData.timeSlot}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Files & Services</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Files:</span> {files.length} file(s)</p>
                      <p><span className="font-medium">Services:</span> {selectedServices.length} selected</p>
                      <p><span className="font-medium text-blue-600">Total:</span> ₹{totalAmount.toFixed(2)}</p>
                      {deliveryRequested && (
                        <Badge className="bg-green-100 text-green-800">Free delivery included</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">Special Instructions</h4>
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{formData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-8"
            >
              Previous
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Step {currentStep} of {steps.length}</p>
              {totalAmount > 0 && (
                <p className="text-lg font-bold text-blue-600">Total: ₹{totalAmount.toFixed(2)}</p>
              )}
            </div>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNext()}
                className="px-8 bg-blue-600 hover:bg-blue-700"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                type="submit" 
                size="lg" 
                className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                disabled={isSubmitting || selectedServices.length === 0}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Order...
                  </div>
                ) : (
                  <>
                    <Printer className="w-6 h-6 mr-3" />
                    Submit Print Job
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default PrintJobForm;
