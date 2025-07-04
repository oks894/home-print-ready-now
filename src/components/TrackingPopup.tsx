
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ExternalLink, RotateCcw, CheckCircle, Package, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface TrackingPopupProps {
  trackingId: string;
  onClose: () => void;
  onNewOrder: () => void;
}

const TrackingPopup = ({ trackingId, onClose, onNewOrder }: TrackingPopupProps) => {
  const { toast } = useToast();

  // Auto-copy tracking ID when popup opens
  useEffect(() => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId).then(() => {
        toast({
          title: "Tracking ID Auto-Copied!",
          description: "Your tracking ID has been automatically copied to clipboard.",
        });
      }).catch(() => {
        console.log('Auto-copy failed, manual copy available');
      });
    }
  }, [trackingId, toast]);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingId).then(() => {
      toast({
        title: "Copied!",
        description: "Tracking ID copied to clipboard.",
      });
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center relative pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Order Submitted Successfully!
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Your print job has been received and tracking ID auto-copied
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Call Notification */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-700">Confirmation Call</span>
                <Clock className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-blue-700 font-medium">You will receive a call within 30 minutes to confirm your order details</p>
            </motion.div>

            {/* Tracking ID Display */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-700">Your Tracking ID</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Auto-copied!</span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <span className="font-mono text-lg font-bold text-purple-600">{trackingId}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs hover:bg-purple-50"
                >
                  Copy Again
                </Button>
              </div>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-gray-700">What happens next?</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>We'll call you within 30 minutes to confirm details</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Your documents will be printed with premium quality</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Collect at your scheduled time or receive via delivery</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Link to="/track" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Go to Tracking Page
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={onNewOrder}
                className="w-full border-2 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Submit Another Order
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xs text-gray-500 text-center"
            >
              Save your tracking ID to check your order status anytime
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TrackingPopup;
