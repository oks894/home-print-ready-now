
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlotSelectorProps {
  timeSlot: string;
  notes: string;
  onTimeSlotChange: (timeSlot: string) => void;
  onNotesChange: (notes: string) => void;
}

const TimeSlotSelector = ({ timeSlot, notes, onTimeSlotChange, onNotesChange }: TimeSlotSelectorProps) => {
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM'
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Pickup Time
        </CardTitle>
        <CardDescription>
          Choose when you'd like to collect your printed documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={timeSlot} onValueChange={onTimeSlotChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div>
          <Label htmlFor="notes">Special Instructions (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Color printing, double-sided, binding, etc."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
