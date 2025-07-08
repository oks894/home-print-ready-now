
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PrintJob } from '@/types/printJob';

interface FilesListProps {
  job: PrintJob;
}

export const FilesList = ({ job }: FilesListProps) => {
  const { toast } = useToast();
  const files = job.files;

  const downloadFile = (fileName: string, fileUrl?: string, fileData?: string) => {
    if (fileUrl) {
      // For files stored in Supabase Storage
      window.open(fileUrl, '_blank');
      toast({
        title: "File opened",
        description: `Opening ${fileName} in a new tab`,
      });
    } else if (fileData) {
      // For legacy base64 files
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${fileName}`,
      });
    } else {
      toast({
        title: "File not available",
        description: "This file cannot be accessed",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Files to Print</h4>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getFileIcon(file.name)}</span>
                <div className="font-medium text-xs sm:text-sm truncate">{file.name}</div>
              </div>
              <div className="text-xs text-gray-500 ml-7">
                {(file.size / 1024 / 1024).toFixed(2)} MB
                {file.type && ` • ${file.type}`}
              </div>
            </div>
            <div className="flex gap-1 ml-2 flex-shrink-0">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => downloadFile(file.name, file.url, file.data)}
                className="h-8 w-8 p-0"
                title={file.url ? "Open file" : "Download file"}
              >
                {file.url ? (
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
