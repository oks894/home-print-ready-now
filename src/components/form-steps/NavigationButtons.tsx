
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const NavigationButtons = ({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}: NavigationButtonsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between mt-8"
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="flex items-center gap-2 h-12 px-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Previous
      </Button>
      
      <div className="flex gap-4">
        {currentStep < totalSteps - 1 ? (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Next Step
            <ArrowRight className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
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
  );
};

export default NavigationButtons;
