
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface EstimatedCompletionInputProps {
  value?: string;
  onChange: (value: string) => void;
}

export const EstimatedCompletionInput = ({ value, onChange }: EstimatedCompletionInputProps) => {
  const [date, setDate] = useState(value ? new Date(value).toISOString().split('T')[0] : '');
  const [time, setTime] = useState(value ? 
    new Date(value).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : 
    '12:00'
  );

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (newDate && time) {
      const datetime = new Date(`${newDate}T${time}`);
      onChange(datetime.toISOString());
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date && newTime) {
      const datetime = new Date(`${date}T${newTime}`);
      onChange(datetime.toISOString());
    }
  };

  const formatDisplayValue = () => {
    if (!value) return '';
    const date = new Date(value);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Estimated Completion (Optional)
      </Label>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="completion-date" className="text-xs text-gray-500">Date</Label>
          <Input
            id="completion-date"
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="completion-time" className="text-xs text-gray-500">Time</Label>
          <Input
            id="completion-time"
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      {value && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          Display: {formatDisplayValue()}
        </div>
      )}
      
      {date && time && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setDate('');
            setTime('12:00');
            onChange('');
          }}
        >
          Clear
        </Button>
      )}
    </div>
  );
};
