import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Eye, FileText, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const BrowseNotes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [sortBy, setSortBy] = useState('recent');

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['note-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('note_categories')
        .select('*')
        .order('display_order');
      return data || [];
    }
  });

  // Fetch notes
  const { data: notes, refetch } = useQuery({
    queryKey: ['notes', selectedClass, selectedSubject, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('notes')
        .select('*')
        .eq('is_approved', true)
        .eq('status', 'approved');

      if (selectedClass) {
        query = query.eq('class_level', selectedClass);
      }

      if (selectedSubject) {
        query = query.eq('subject', selectedSubject);
      }

      if (sortBy === 'downloads') {
        query = query.order('download_count', { ascending: false });
      } else if (sortBy === 'views') {
        query = query.order('view_count', { ascending: false });
      } else {
        query = query.order('upload_date', { ascending: false });
      }

      const { data } = await query;
      return data || [];
    }
  });

  const selectedCategory = categories?.find(c => c.class_level === selectedClass);
  const subjects = selectedCategory?.subjects as string[] || [];

  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.uploader_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (note: any) => {
    try {
      // Increment download count
      await supabase
        .from('notes')
        .update({ download_count: note.download_count + 1 })
        .eq('id', note.id);

      // Trigger download
      window.open(note.file_url, '_blank');
      
      refetch();
      
      toast({
        title: 'Download started',
        description: 'Your file is being downloaded'
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'There was an error downloading the file',
        variant: 'destructive'
      });
    }
  };

  const handleView = async (note: any) => {
    try {
      // Increment view count
      await supabase
        .from('notes')
        .update({ view_count: note.view_count + 1 })
        .eq('id', note.id);

      // Open in new tab
      window.open(note.file_url, '_blank');
      
      refetch();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error opening the file',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Header />
      
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full mb-4">
                <Search className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Browse Notes</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Find Study Notes</h1>
              <p className="text-muted-foreground">
                Browse through thousands of student-contributed notes
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <Card className="p-6 h-fit lg:sticky lg:top-20">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Class/Level</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Classes</SelectItem>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.class_level}>
                            {cat.class_level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!selectedClass}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Subjects</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="downloads">Most Downloaded</SelectItem>
                        <SelectItem value="views">Most Viewed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedClass('');
                      setSelectedSubject('');
                      setSortBy('recent');
                      setSearchTerm('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>

              {/* Notes Grid */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      placeholder="Search notes by title, subject, or contributor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {filteredNotes && filteredNotes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="p-6 h-full flex flex-col hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1 truncate">{note.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {note.class_level} - {note.subject}
                              </p>
                            </div>
                          </div>

                          {note.description && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {note.description}
                            </p>
                          )}

                          <div className="mt-auto">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span>By {note.uploader_name}</span>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {note.view_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {note.download_count}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleView(note)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => handleDownload(note)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No notes found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline" onClick={() => window.location.href = '/ellio-notes/request'}>
                        Request Notes
                      </Button>
                      <Button onClick={() => window.location.href = '/ellio-notes/upload'}>
                        Upload Notes
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrowseNotes;
