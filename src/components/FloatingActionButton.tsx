import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, FileText, Printer, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'print',
    label: 'Print Documents',
    icon: Printer,
    path: '/ellio-prints',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'upload-notes',
    label: 'Upload Notes',
    icon: Upload,
    path: '/ellio-notes/upload',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'assignment',
    label: 'Get Assignment Help',
    icon: GraduationCap,
    path: '/ellio-notes/assignment-help/upload',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'resume',
    label: 'Build Resume',
    icon: FileText,
    path: '/resume-lab',
    color: 'bg-pink-500 hover:bg-pink-600',
  },
];

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleActionClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="fixed bottom-24 md:bottom-8 right-4 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <>
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 20, 
                    scale: 0.8,
                    transition: { delay: (quickActions.length - index) * 0.03 }
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="px-3 py-2 bg-background rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                  <Button
                    size="icon"
                    className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white`}
                    onClick={() => handleActionClick(action.path)}
                  >
                    <action.icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.div
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-xl bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default FloatingActionButton;
