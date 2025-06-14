
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import TimeSlotSelector from '../../TimeSlotSelector';

interface ScheduleStepProps {
  formData: {
    name: string;
    phone: string;
    institute: string;
    timeSlot: string;
    notes: string;
  };
  onFormDataChange: (data: any) => void;
  canAccessDelivery: boolean;
  deliveryRequested: boolean;
  onDeliveryRequestedChange: (requested: boolean) => void;
}

const ScheduleStep = ({
  formData,
  onFormDataChange,
  canAccessDelivery,
  deliveryRequested,
  onDeliveryRequestedChange
}: ScheduleStepProps) => {
  return (
    <div className="space-y-6">
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
        onTimeSlotChange={(slot) => onFormDataChange({...formData, timeSlot: slot})}
        onNotesChange={(notes) => onFormDataChange({...formData, notes})}
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
              onChange={(e) => onDeliveryRequestedChange(e.target.checked)}
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
    </div>
  );
};

export default ScheduleStep;
