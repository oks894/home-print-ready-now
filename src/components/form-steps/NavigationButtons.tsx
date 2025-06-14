
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TouchButton } from '@/components/mobile/TouchButton';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const ButtonComponent = isMobile ? TouchButton : Button;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMobile ? 'flex-col gap-3 mt-6' : 'justify-between mt-8'}`}
    >
      {!isMobile && (
        <ButtonComponent
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2 h-12 px-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </ButtonComponent>
      )}
      
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4'}`}>
        {isMobile && currentStep > 0 && (
          <ButtonComponent
            variant="outline"
            onClick={onPrevious}
            className="flex items-center justify-center gap-2 h-12 w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous Step
          </ButtonComponent>
        )}

        {currentStep < totalSteps - 1 ? (
          <ButtonComponent
            onClick={onNext}
            disabled={!canProceed}
            className={`flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white ${
              isMobile ? 'w-full text-lg font-semibold' : 'px-8'
            }`}
          >
            {isMobile ? 'Continue' : 'Next Step'}
            <ArrowRight className="w-5 h-5" />
          </ButtonComponent>
        ) : (
          <ButtonComponent
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            className={`flex items-center justify-center gap-2 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white ${
              isMobile ? 'w-full text-lg font-semibold' : 'px-8'
            }`}
          >
            {isSubmitting ? (
              <>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                {isMobile ? 'Processing...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Star className="w-5 h-5" />
                {isMobile ? 'Submit Order' : 'Submit Order'}
              </>
            )}
          </ButtonComponent>
        )}
      </div>
    </motion.div>
  );
};

export default NavigationButtons;
