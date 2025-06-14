
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, ExternalLink, RotateCcw, CheckCircle, Package, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TrackingPopupProps {
  trackingId: string;
  onClose: () => void;
  onNewOrder: () => void;
}

const TrackingPopup = ({ trackingId, onClose, onNewOrder }: TrackingPopupProps) => {
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
              Your print job has been received and is being processed
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Tracking ID Display */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-700">Your Tracking ID</span>
              </div>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <span className="font-mono text-lg font-bold text-blue-600">{trackingId}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(trackingId)}
                  className="text-xs hover:bg-blue-50"
                >
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                <Phone className="w-4 h-4" />
                This is your phone number - use it to track your order
              </p>
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
                  <span>We'll call you shortly to confirm your order details</span>
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
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TrackingPopup;
