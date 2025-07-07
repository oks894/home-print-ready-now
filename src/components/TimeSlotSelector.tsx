
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
  isAdminView?: boolean;
}

const TimeSlotSelector = ({ timeSlot, notes, onTimeSlotChange, onNotesChange, isAdminView = false }: TimeSlotSelectorProps) => {
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM'
  ];

  const getDayOptions = () => {
    const days = [];
    const today = new Date();
    
    // Generate next 14 days but filter for Mon-Sat only
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.getDay();
      // Skip Sunday (0)
      if (dayOfWeek === 0) continue;
      
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
          </div>
          <span className="hidden sm:inline">Pickup Schedule</span>
          <span className="sm:hidden">Schedule</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Choose when you'd like to collect your printed documents (Mon-Sat: 9AM-4PM)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="timeSlot" className="text-sm font-medium">Select Day & Time</Label>
          <Select value={timeSlot} onValueChange={onTimeSlotChange}>
            <SelectTrigger className="h-11 text-base">
              <SelectValue placeholder="Select a day and time slot" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {generateTimeSlotOptions().map((slot) => (
                <SelectItem key={slot} value={slot} className="text-sm">
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!isAdminView && (
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Color printing, double-sided, binding, passport photos, etc."
              rows={3}
              className="text-base resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeSlotSelector;
