
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { isPrintingService } from '@/utils/serviceUtils';

interface BulkDiscountAlertProps {
  bulkInfo: { hasBulkDiscount: boolean; savings: number } | null;
  quantity: number;
  serviceCategory: string;
}

const BulkDiscountAlert: React.FC<BulkDiscountAlertProps> = ({
  bulkInfo,
  quantity,
  serviceCategory
}) => {
  if (bulkInfo?.hasBulkDiscount) {
    return (
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-green-100 text-green-800 text-xs">
            Bulk Discount Applied!
          </Badge>
        </div>
        <p className="text-xs text-green-700">
          You saved ₹{bulkInfo.savings.toFixed(2)} with bulk pricing
        </p>
      </div>
    );
  }

  if (quantity >= 40 && quantity < 50 && isPrintingService(serviceCategory)) {
    return (
      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-700">
          Add {50 - quantity} more pages to unlock ₹2.5/page bulk pricing!
        </p>
      </div>
    );
  }

  return null;
};

export default BulkDiscountAlert;
