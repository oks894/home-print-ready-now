import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Upload, Search, Trophy, TrendingUp, Clock, Users, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EllioNotes = () => {
  const navigate = useNavigate();

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['notes-stats'],
    queryFn: async () => {
      const [notesCount, categoriesCount] = await Promise.all([
        supabase.from('notes').select('*', { count: 'exact', head: true }),
        supabase.from('note_categories').select('*', { count: 'exact', head: true })
      ]);

      const { data: downloads } = await supabase
        .from('notes')
        .select('download_count');
      
      const totalDownloads = downloads?.reduce((sum, note) => sum + (note.download_count || 0), 0) || 0;

      return {
        totalNotes: notesCount.count || 0,
        totalContributors: 0, // Will be calculated with user tracking
        totalDownloads
      };
    }
  });

  const features = [
    {
      icon: Search,
      title: 'Browse by Class',
      description: 'Find notes organized by class level and subject',
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/ellio-notes/browse')
    },
    {
      icon: Upload,
      title: 'Upload Notes',
      description: 'Share your knowledge and help fellow students',
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/ellio-notes/upload')
    },
    {
      icon: Trophy,
      title: 'Top Contributors',
      description: 'See who\'s helping the community the most',
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/ellio-notes/leaderboard')
    },
    {
      icon: Clock,
      title: 'Request Notes',
      description: 'Can\'t find what you need? Request it!',
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/ellio-notes/request')
    },
    {
      icon: GraduationCap,
      title: 'Assignment Help',
      description: 'Get expert help with your assignments',
      color: 'from-indigo-500 to-purple-500',
      action: () => navigate('/ellio-notes/assignment-help')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Ellio Notes</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Learn from Students, for Students
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Access thousands of student-shared notes, upload your own, and help build the ultimate study resource
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/ellio-notes/browse')}
                className="text-lg px-8 bg-green-600 hover:bg-green-700"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Notes
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/ellio-notes/upload')}
                className="text-lg px-8"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Notes
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/ellio-notes/request')}
                className="text-lg px-8"
              >
                <Clock className="w-5 h-5 mr-2" />
                Request Notes
              </Button>
            </div>
          </motion.div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <Card className="p-6 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <p className="text-4xl font-bold text-green-600 mb-2">{stats?.totalNotes || 0}</p>
              <p className="text-muted-foreground">Notes Shared</p>
            </Card>
            <Card className="p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-teal-600" />
              <p className="text-4xl font-bold text-teal-600 mb-2">{stats?.totalContributors || 0}</p>
              <p className="text-muted-foreground">Contributors</p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
              <p className="text-4xl font-bold text-cyan-600 mb-2">{stats?.totalDownloads || 0}</p>
              <p className="text-muted-foreground">Downloads</p>
            </Card>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={feature.action}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl font-bold mb-4">How Ellio Notes Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="w-16 h-16 rounded-full bg-white/20 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse & Download</h3>
                <p className="opacity-90">Find notes by class and subject, download instantly</p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-white/20 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload & Share</h3>
                <p className="opacity-90">Share your notes and help fellow students succeed</p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-white/20 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Request Notes</h3>
                <p className="opacity-90">Can't find something? Request it from the community</p>
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/ellio-notes/browse')}
              className="mt-8 text-lg px-8"
            >
              Start Exploring
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EllioNotes;
