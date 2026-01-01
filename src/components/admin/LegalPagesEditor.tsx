import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { FileText, Shield, Save, Loader2, Eye } from 'lucide-react';

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
  updated_by: string | null;
}

const LegalPagesEditor = () => {
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSlug, setActiveSlug] = useState('terms');
  const [editedContent, setEditedContent] = useState<Record<string, { title: string; content: string }>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .order('slug');

      if (error) throw error;
      setPages(data || []);
      
      // Initialize edited content
      const initial: Record<string, { title: string; content: string }> = {};
      (data || []).forEach(page => {
        initial[page.slug] = { title: page.title, content: page.content };
      });
      setEditedContent(initial);
    } catch (err) {
      console.error('Error fetching legal pages:', err);
      toast.error('Failed to load legal pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (slug: string) => {
    const edited = editedContent[slug];
    if (!edited) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('legal_pages')
        .update({
          title: edited.title,
          content: edited.content,
          updated_at: new Date().toISOString(),
          updated_by: 'Admin'
        })
        .eq('slug', slug);

      if (error) throw error;
      toast.success(`${slug === 'terms' ? 'Terms of Service' : 'Privacy Policy'} updated successfully`);
      fetchPages();
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (slug: string, field: 'title' | 'content', value: string) => {
    setEditedContent(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value
      }
    }));
  };

  const renderPreview = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-3 mt-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-2 mt-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mb-1 mt-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4">{line.slice(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="text-sm text-muted-foreground">{line}</p>;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Legal Pages</h2>
        <p className="text-muted-foreground">Edit Terms of Service and Privacy Policy</p>
      </div>

      <Tabs value={activeSlug} onValueChange={setActiveSlug}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </TabsTrigger>
        </TabsList>

        {['terms', 'privacy'].map(slug => (
          <TabsContent key={slug} value={slug}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{slug === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</CardTitle>
                    <CardDescription>
                      Use Markdown format: # Heading, ## Subheading, - List item
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? 'Edit' : 'Preview'}
                    </Button>
                    <Button
                      onClick={() => handleSave(slug)}
                      disabled={isSaving}
                      size="sm"
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Page Title</Label>
                  <Input
                    value={editedContent[slug]?.title || ''}
                    onChange={(e) => updateContent(slug, 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>

                {showPreview ? (
                  <div className="border rounded-lg p-6 bg-accent/50 min-h-[400px] max-h-[600px] overflow-y-auto">
                    {renderPreview(editedContent[slug]?.content || '')}
                  </div>
                ) : (
                  <div>
                    <Label>Content (Markdown)</Label>
                    <Textarea
                      value={editedContent[slug]?.content || ''}
                      onChange={(e) => updateContent(slug, 'content', e.target.value)}
                      className="mt-1 min-h-[400px] font-mono text-sm"
                      placeholder="# Title&#10;## Section&#10;- Bullet point&#10;&#10;Paragraph text..."
                    />
                  </div>
                )}

                {pages.find(p => p.slug === slug)?.updated_at && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(pages.find(p => p.slug === slug)!.updated_at).toLocaleString()}
                    {pages.find(p => p.slug === slug)?.updated_by && ` by ${pages.find(p => p.slug === slug)?.updated_by}`}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LegalPagesEditor;
