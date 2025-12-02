import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Printer, BookOpen, GraduationCap, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
}

export const StatisticsBar = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { label: 'Documents Printed', value: 500, suffix: '+', icon: Printer },
    { label: 'Notes Available', value: 150, suffix: '+', icon: BookOpen },
    { label: 'Assignments Solved', value: 50, suffix: '+', icon: GraduationCap },
    { label: 'Happy Students', value: 200, suffix: '+', icon: Users },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [printRes, notesRes, assignmentsRes] = await Promise.all([
          supabase.from('print_jobs').select('id', { count: 'exact', head: true }),
          supabase.from('notes').select('id', { count: 'exact', head: true }).eq('is_approved', true),
          supabase.from('assignments').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
        ]);

        setStats([
          { label: 'Documents Printed', value: Math.max(printRes.count || 0, 500), suffix: '+', icon: Printer },
          { label: 'Notes Available', value: Math.max(notesRes.count || 0, 150), suffix: '+', icon: BookOpen },
          { label: 'Assignments Solved', value: Math.max(assignmentsRes.count || 0, 50), suffix: '+', icon: GraduationCap },
          { label: 'Happy Students', value: 200, suffix: '+', icon: Users },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-purple-600 to-blue-600">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center text-white"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1">
                <CountUp end={stat.value} />{stat.suffix}
              </div>
              <div className="text-sm md:text-base text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Simple count up animation
const CountUp = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return <span>{count}</span>;
};

export default StatisticsBar;
