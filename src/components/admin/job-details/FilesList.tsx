
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  name: string;
  size: number;
  data?: string;
}

interface FilesListProps {
  files: FileItem[];
}

export const FilesList = ({ files }: FilesListProps) => {
  const { toast } = useToast();

  const downloadFile = (fileName: string, fileData?: string) => {
    if (fileData) {
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
        description: "This file cannot be downloaded",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Files to Print</h4>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-xs sm:text-sm truncate">{file.name}</div>
              <div className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => downloadFile(file.name, file.data)}
              className="ml-2 flex-shrink-0"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
