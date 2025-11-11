import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
}

export const PaymentStatusBadge = ({ status, className }: PaymentStatusBadgeProps) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Payment Pending Verification',
      variant: 'secondary' as const,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    },
    approved: {
      icon: CheckCircle,
      label: 'Payment Verified ✓',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    },
    rejected: {
      icon: XCircle,
      label: 'Payment Rejected',
      variant: 'destructive' as const,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};
