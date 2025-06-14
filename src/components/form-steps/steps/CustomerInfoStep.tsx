
import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import CustomerForm from '../../CustomerForm';

interface CustomerInfoStepProps {
  formData: {
    name: string;
    phone: string;
    institute: string;
    timeSlot: string;
    notes: string;
  };
  onFormDataChange: (data: any) => void;
}

const CustomerInfoStep = ({ formData, onFormDataChange }: CustomerInfoStepProps) => {
  return (
    <div>
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
        onFormDataChange={onFormDataChange}
      />
    </div>
  );
};

export default CustomerInfoStep;
