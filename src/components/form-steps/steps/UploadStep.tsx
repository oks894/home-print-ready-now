
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle } from 'lucide-react';
import FileUploadOptimized from '../../FileUploadOptimized';

interface UploadStepProps {
  uploadedFiles: Array<{ name: string; url: string; size: number; type: string }>;
  onFilesUploaded: (files: Array<{ name: string; url: string; size: number; type: string }>) => void;
}

const UploadStep = ({ uploadedFiles, onFilesUploaded }: UploadStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
        >
          <FileText className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Upload Your Documents
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Upload your files quickly and securely. Large files are now processed much faster with real-time progress tracking.
        </p>
      </div>
      
      <FileUploadOptimized onFilesUploaded={onFilesUploaded} />
      
      {uploadedFiles.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-4 rounded-lg border border-green-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-900">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
            </span>
          </div>
          <p className="text-sm text-green-700">
            Total size: {(uploadedFiles.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default UploadStep;
