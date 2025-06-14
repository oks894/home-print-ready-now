
import React from 'react';
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

  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    toast({
      title: "Copied!",
      description: "Tracking ID copied to clipboard",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Order Submitted!</CardTitle>
          <CardDescription>
            Your print job has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Your Tracking ID:</p>
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="font-mono text-lg font-bold text-blue-600 flex-1 text-center">
                {trackingId}
              </span>
              <Button size="sm" variant="outline" onClick={copyTrackingId}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Save this ID to track your order
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={onNewOrder} className="flex-1">
              New Order
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPopup;
