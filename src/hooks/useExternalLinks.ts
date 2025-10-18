import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useExternalLinks = () => {
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadLinks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      console.error('Error loading links:', error);
      toast({
        title: 'Error',
        description: 'Failed to load external links',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = async (link: Omit<ExternalLink, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('external_links')
        .insert([link])
        .select()
        .single();

      if (error) throw error;

      setLinks([...links, data]);
      toast({
        title: 'Success',
        description: 'Link added successfully',
      });
      return data;
    } catch (error: any) {
      console.error('Error adding link:', error);
      toast({
        title: 'Error',
        description: 'Failed to add link',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateLink = async (id: string, updates: Partial<ExternalLink>) => {
    try {
      const { data, error } = await supabase
        .from('external_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setLinks(links.map(link => link.id === id ? data : link));
      toast({
        title: 'Success',
        description: 'Link updated successfully',
      });
      return data;
    } catch (error: any) {
      console.error('Error updating link:', error);
      toast({
        title: 'Error',
        description: 'Failed to update link',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('external_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLinks(links.filter(link => link.id !== id));
      toast({
        title: 'Success',
        description: 'Link deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return {
    links,
    isLoading,
    addLink,
    updateLink,
    deleteLink,
    refresh: loadLinks,
  };
};
