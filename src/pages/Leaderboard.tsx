import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Leaderboard = () => {
  // Fetch top contributors
  const { data: contributors } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('notes')
        .select('uploader_name, download_count')
        .eq('is_approved', true);

      if (!data) return [];

      // Group by uploader and calculate stats
      const contributorMap = new Map();
      data.forEach(note => {
        const current = contributorMap.get(note.uploader_name) || { uploads: 0, downloads: 0 };
        contributorMap.set(note.uploader_name, {
          uploads: current.uploads + 1,
          downloads: current.downloads + (note.download_count || 0)
        });
      });

      // Convert to array and calculate impact score
      const leaderboard = Array.from(contributorMap.entries()).map(([name, stats]) => ({
        name,
        uploads: stats.uploads,
        downloads: stats.downloads,
        impactScore: (stats.uploads * 10) + (stats.downloads / 10)
      }));

      // Sort by impact score
      return leaderboard.sort((a, b) => b.impactScore - a.impactScore);
    }
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{index + 1}</span>;
  };

  const getStars = (score: number) => {
    const starCount = Math.min(5, Math.floor(score / 100));
    return '⭐'.repeat(starCount || 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full mb-4">
                <Trophy className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Top Contributors</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Leaderboard
              </h1>
              <p className="text-xl text-muted-foreground">
                Celebrating students helping students
              </p>
            </div>

            {contributors && contributors.length > 0 ? (
              <div className="space-y-4">
                {contributors.map((contributor, index) => (
                  <motion.div
                    key={contributor.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className={`p-6 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200' :
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200' :
                      index === 2 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200' :
                      ''
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(index)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">{contributor.name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>📚 {contributor.uploads} uploads</span>
                            <span>📥 {contributor.downloads} downloads</span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {Math.round(contributor.impactScore)}
                          </div>
                          <div className="text-xs text-muted-foreground">Impact Score</div>
                          <div className="mt-1">{getStars(contributor.impactScore)}</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No contributors yet</h3>
                <p className="text-muted-foreground">
                  Be the first to contribute notes and top the leaderboard!
                </p>
              </Card>
            )}

            <Card className="p-6 mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">How Impact Score Works</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Impact Score = (Number of Uploads × 10) + (Total Downloads ÷ 10)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The more you contribute and the more students download your notes, the higher your impact score!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leaderboard;
