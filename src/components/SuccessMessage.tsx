
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SuccessMessageProps {
  onNewOrder: () => void;
}

const SuccessMessage = ({ onNewOrder }: SuccessMessageProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Order Confirmed!</CardTitle>
          <CardDescription>
            Your print job has been submitted successfully. We'll call you to confirm the details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onNewOrder} className="w-full">
            Submit Another Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessMessage;
