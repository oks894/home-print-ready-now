
import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';

interface FileUploadOptimizedProps {
  onFilesUploaded: (files: Array<{ name: string; url: string; size: number; type: string }>) => void;
}

const FileUploadOptimized = ({ onFilesUploaded }: FileUploadOptimizedProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadFiles, uploadProgress, isUploading, clearProgress } = useFileUpload();
  const { toast } = useToast();

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(file.type)) {
        return false;
      }
      
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 100MB limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were rejected",
        description: "Please upload only PDF, Word documents, or images (JPG, PNG) under 100MB each",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      const uploadedFiles = await uploadFiles(selectedFiles);
      onFilesUploaded(uploadedFiles);
      
      toast({
        title: "Files uploaded successfully",
        description: `${uploadedFiles.length} file(s) uploaded and ready for printing`,
      });
      
      // Clear selected files after successful upload
      setSelectedFiles([]);
      clearProgress();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Upload className="w-5 h-5 text-blue-600 flex-shrink-0" />
          Upload Documents
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Upload PDF, Word documents, or images (JPG, PNG) that you want to print (Max 100MB per file)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileSelection}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg font-medium text-gray-700 mb-1">
              {isUploading ? 'Uploading...' : 'Click to select files'}
            </p>
            <p className="text-sm text-gray-500">Supports PDF, Word, JPG, PNG (Max 100MB each)</p>
          </label>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700 text-sm sm:text-base">Selected Files:</h4>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>
            
            {selectedFiles.map((file, index) => {
              const progressItem = uploadProgress[index];
              return (
                <div key={index} className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getStatusIcon(progressItem?.status || 'pending')}
                      <span className="font-medium text-sm sm:text-base truncate">{file.name}</span>
                    </div>
                    {!isUploading && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0 h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    {progressItem?.status === 'uploading' && (
                      <>
                        <span>•</span>
                        <span>{progressItem.progress}%</span>
                      </>
                    )}
                    {progressItem?.status === 'error' && (
                      <>
                        <span>•</span>
                        <span className="text-red-500">Failed</span>
                      </>
                    )}
                    {progressItem?.status === 'completed' && (
                      <>
                        <span>•</span>
                        <span className="text-green-500">Uploaded</span>
                      </>
                    )}
                  </div>
                  
                  {progressItem?.status === 'uploading' && (
                    <Progress value={progressItem.progress} className="mt-2 h-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadOptimized;
