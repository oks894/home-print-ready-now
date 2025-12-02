import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Printer, BookOpen, GraduationCap, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    label: 'Start Printing',
    icon: Printer,
    path: '/ellio-prints',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    label: 'Browse Notes',
    icon: BookOpen,
    path: '/ellio-notes',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    label: 'Assignment Help',
    icon: GraduationCap,
    path: '/ellio-notes/assignment-help',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    label: 'Build Resume',
    icon: FileText,
    path: '/resume-lab',
    color: 'bg-pink-500 hover:bg-pink-600',
  },
];

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of students using Ellio for their academic needs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {actions.map((action, index) => (
            <Button
              key={action.label}
              size="lg"
              className={`h-auto py-6 flex flex-col items-center gap-2 ${action.color} text-white`}
              onClick={() => navigate(action.path)}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <p className="text-sm text-muted-foreground italic">
            "Powered by Dynamic Edu — Learn, Print, Progress."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
