
export interface PrintJob {
  id: string;
  tracking_id: string;
  name: string;
  phone: string;
  institute: string;
  time_slot: string;
  notes: string;
  files: Array<{ name: string; size: number; type: string; data?: string }>;
  timestamp: string;
  status: 'pending' | 'pending_payment' | 'printing' | 'ready' | 'completed';
  selected_services?: Array<{ id: string; name: string; quantity: number; price: number }>;
  total_amount?: number;
  delivery_requested?: boolean;
  estimated_completion?: string;
}
