
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DeliveryOptionProps {
  canAccessDelivery: boolean;
}

const DeliveryOption: React.FC<DeliveryOptionProps> = ({ canAccessDelivery }) => {
  if (!canAccessDelivery) {
    return null;
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">🚚</span>
          <div>
            <CardTitle className="text-base text-green-800">Doorstep Delivery</CardTitle>
            <CardDescription className="text-green-600">
              FREE - Unlocked for orders ₹200+
            </CardDescription>
          </div>
          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
            Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-green-700">
          Powered by DROPEE - Your order qualifies for free doorstep delivery!
        </p>
      </CardContent>
    </Card>
  );
};

export default DeliveryOption;
