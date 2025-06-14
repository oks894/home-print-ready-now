
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Step {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  const isMobile = useIsMobile();
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isMobile) {
    // Mobile: Simplified horizontal progress bar with current step info
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 px-2"
      >
        {/* Current Step Info */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${steps[currentStep].color} text-white shadow-lg`}>
              <steps[currentStep].icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900">
                {steps[currentStep].title}
              </h4>
              <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          <span className="font-medium text-purple-600">{Math.round(progress)}% Complete</span>
        </div>
      </motion.div>
    );
  }

  // Desktop: Full step indicators
  return (
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
  );
};

export default StepProgress;
