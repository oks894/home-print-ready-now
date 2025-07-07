
import React from 'react';
import { FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AdminNotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const AdminNotesInput = ({ value, onChange }: AdminNotesInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Admin Notes (Not visible to customer)
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Internal notes about this order..."
        rows={3}
        className="text-sm resize-none"
      />
      <p className="text-xs text-gray-500">
        These notes are only visible to admin users and won't be shown to the customer.
      </p>
    </div>
  );
};
