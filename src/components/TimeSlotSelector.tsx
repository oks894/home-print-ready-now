
import React from 'react';
import { Clock, Calendar } from 'lucide-react';
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

  const getDayOptions = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      days.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? `Today (${dayName}, ${dateStr})` : 
               i === 1 ? `Tomorrow (${dayName}, ${dateStr})` : 
               `${dayName}, ${dateStr}`
      });
    }
    
    return days;
  };

  const generateTimeSlotOptions = () => {
    const days = getDayOptions();
    const options: string[] = [];
    
    days.forEach(day => {
      timeSlots.forEach(time => {
        options.push(`${day.label} - ${time}`);
      });
    });
    
    return options;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          Pickup Schedule
        </CardTitle>
        <CardDescription>
          Choose when you'd like to collect your printed documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="timeSlot">Select Day & Time</Label>
          <Select value={timeSlot} onValueChange={onTimeSlotChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a day and time slot" />
            </SelectTrigger>
            <SelectContent>
              {generateTimeSlotOptions().map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notes">Special Instructions (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Color printing, double-sided, binding, passport photos, etc."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
