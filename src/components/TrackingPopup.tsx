
import React, { useEffect } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
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
          title: "Tracking ID Copied!",
          description: "Your tracking ID has been automatically copied to clipboard",
        });
      }).catch(() => {
        // Fallback if clipboard API fails
        console.log('Auto-copy failed, user can manually copy');
      });
    }
  }, [trackingId, toast]);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    toast({
      title: "Copied!",
      description: "Tracking ID copied to clipboard",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl text-green-600">Order Submitted!</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Your print job has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Tracking ID (Auto-copied):</p>
            <div className="flex items-center gap-2 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <span className="font-mono text-lg sm:text-xl font-bold text-blue-600 flex-1 text-center break-all">
                {trackingId}
              </span>
              <Button size="sm" variant="outline" onClick={copyTrackingId} className="flex-shrink-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Save this ID to track your order
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onNewOrder} className="flex-1 h-11">
              New Order
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 h-11">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPopup;
