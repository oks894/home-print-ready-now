
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFiles = useCallback(async (files: File[]): Promise<Array<{ name: string; url: string; size: number; type: string }>> => {
    setIsUploading(true);
    
    // Initialize progress tracking
    const initialProgress = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    setUploadProgress(initialProgress);

    const uploadedFiles: Array<{ name: string; url: string; size: number; type: string }> = [];

    try {
      // Upload files sequentially to avoid overwhelming the connection
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update status to uploading
        setUploadProgress(prev => prev.map((item, index) => 
          index === i ? { ...item, status: 'uploading' } : item
        ));

        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `print-jobs/${fileName}`;

          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('print-files')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('print-files')
            .getPublicUrl(filePath);

          uploadedFiles.push({
            name: file.name,
            url: publicUrl,
            size: file.size,
            type: file.type
          });

          // Update progress to completed
          setUploadProgress(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'completed', progress: 100, url: publicUrl } : item
          ));

        } catch (error) {
          console.error('Error uploading file:', error);
          
          // Update progress to error
          setUploadProgress(prev => prev.map((item, index) => 
            index === i ? { ...item, status: 'error', error: error.message } : item
          ));

          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive"
          });
        }
      }

      return uploadedFiles;
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const clearProgress = useCallback(() => {
    setUploadProgress([]);
  }, []);

  return {
    uploadFiles,
    uploadProgress,
    isUploading,
    clearProgress
  };
};
