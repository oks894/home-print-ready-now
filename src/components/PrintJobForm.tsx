
import { useState } from 'react';
import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    clearSelection();
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Submit Your Print Job
          </h2>
          <p className="text-lg text-gray-600">
            Fill out the form below and select your services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <input
                type="checkbox"
                id="delivery"
                checked={deliveryRequested}
                onChange={(e) => setDeliveryRequested(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <label htmlFor="delivery" className="text-green-800 font-medium">
                Request free doorstep delivery (Order ₹200+)
              </label>
            </div>
          )}
          
          <TimeSlotSelector
            timeSlot={formData.timeSlot}
            notes={formData.notes}
            onTimeSlotChange={(timeSlot) => setFormData(prev => ({ ...prev, timeSlot }))}
            onNotesChange={(notes) => setFormData(prev => ({ ...prev, notes }))}
          />

          <div className="text-center">
            <Button 
              type="submit" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold min-w-48"
              disabled={isSubmitting || selectedServices.length === 0}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  <Printer className="w-5 h-5 mr-2" />
                  Submit Print Job {totalAmount > 0 && `(₹${totalAmount.toFixed(2)})`}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default PrintJobForm;
