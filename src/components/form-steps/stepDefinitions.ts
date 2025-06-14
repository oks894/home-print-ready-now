
import { FileText, User, Clock, Settings, CheckCircle } from 'lucide-react';

export const steps = [
  { 
    id: 'upload', 
    title: 'Upload Files', 
    icon: FileText, 
    description: 'Upload your documents',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'services', 
    title: 'Select Services', 
    icon: Settings, 
    description: 'Choose printing options',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'info', 
    title: 'Your Details', 
    icon: User, 
    description: 'Contact information',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'schedule', 
    title: 'Schedule', 
    icon: Clock, 
    description: 'Pick up time',
    color: 'from-orange-500 to-red-500'
  },
  { 
    id: 'review', 
    title: 'Review & Submit', 
    icon: CheckCircle, 
    description: 'Confirm your order',
    color: 'from-indigo-500 to-purple-500'
  }
];
