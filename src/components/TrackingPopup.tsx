
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle, Star, Sparkles, Gift, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TrackingPopupProps {
  trackingId: string;
  onClose: () => void;
  onNewOrder: () => void;
}

const TrackingPopup = ({ trackingId, onClose, onNewOrder }: TrackingPopupProps) => {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Auto-copy tracking ID when popup opens
  useEffect(() => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId).then(() => {
        toast({
          title: "📋 Tracking ID Copied!",
          description: "Your tracking ID has been automatically copied to clipboard",
        });
      }).catch(() => {
        console.log('Auto-copy failed, user can manually copy');
      });
    }
  }, [trackingId, toast]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "✅ Copied!",
      description: "Tracking ID copied to clipboard",
    });
  };

  const confettiElements = Array.from({ length: 50 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
      initial={{
        x: Math.random() * window.innerWidth,
        y: -10,
        rotate: 0,
        opacity: 1
      }}
      animate={{
        y: window.innerHeight + 10,
        rotate: 360,
        opacity: 0
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        ease: "easeOut"
      }}
    />
  ));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {confettiElements}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-emerald-50 overflow-hidden">
          {/* Header with gradient bar */}
          <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500"></div>
          
          <CardHeader className="text-center pb-6 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 p-0 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl relative"
            >
              <CheckCircle className="w-10 h-10 text-white" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-green-400 rounded-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                🎉 Order Submitted Successfully!
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-gray-600">
                Your print job has been received and is being processed
              </CardDescription>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-2 mt-4"
            >
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Premium Service
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Fast Processing
              </Badge>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tracking ID Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Your Tracking Phone Number
                </p>
                <div className="relative">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-blue-600 flex-1 text-center break-all">
                      {trackingId}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={copyTrackingId}
                      className={`flex items-center gap-2 transition-all duration-300 ${
                        copied ? 'bg-green-100 border-green-300 text-green-700' : 'hover:bg-blue-50'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💾 Already copied to your clipboard! Save this number to track your order
                </p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200"
            >
              <h4 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                What happens next?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">📞 We'll call you within 30 minutes to confirm details</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">🖨️ Your documents will be printed with premium quality</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">📱 You'll receive updates via SMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-yellow-800">🚚 Ready for pickup or delivery as scheduled</span>
                </div>
              </div>
            </motion.div>

            {/* Tracking Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200"
            >
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Track Your Order
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Use your phone number to track your order status anytime on our tracking page.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                Go to Tracking Page
              </Button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button 
                onClick={onNewOrder} 
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Place New Order
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 h-12 border-2 hover:bg-gray-50"
              >
                Close
              </Button>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center pt-4 border-t border-gray-200"
            >
              <p className="text-xs text-gray-500">
                Need help? Contact us at <span className="font-medium text-blue-600">support@printshop.com</span>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TrackingPopup;
